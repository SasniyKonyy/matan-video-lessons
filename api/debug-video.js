const { head } = require("@vercel/blob");

module.exports = async function handler(request, response) {
  const pathname = request.query.pathname;

  if (!pathname || typeof pathname !== "string") {
    response.status(400).json({ error: "Missing pathname." });
    return;
  }

  try {
    const blob = await head(pathname, { access: "private" });

    response.status(200).json({
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: blob.size,
      hasUrl: Boolean(blob.url),
      hasDownloadUrl: Boolean(blob.downloadUrl),
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
