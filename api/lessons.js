const { list } = require("@vercel/blob");

const cleanTitle = (pathname) =>
  decodeURIComponent(pathname)
    .replace(/^.*\//, "")
    .replace(/\.mp4$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

module.exports = async function handler(request, response) {
  try {
    const result = await list({ limit: 1000 });
    const lessons = result.blobs
      .filter((blob) => blob.pathname.toLowerCase().endsWith(".mp4"))
      .sort((a, b) => a.pathname.localeCompare(b.pathname, "ru", { numeric: true }))
      .map((blob, index) => ({
        title: cleanTitle(blob.pathname) || `Урок ${index + 1}`,
        src: `/api/video?pathname=${encodeURIComponent(blob.pathname)}`,
      }));

    response.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    response.status(200).json(lessons);
  } catch (error) {
    response.status(500).json({
      error: "Не удалось получить список видео из Vercel Blob.",
      details: error.message,
    });
  }
};
