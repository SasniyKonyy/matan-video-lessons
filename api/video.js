const { get } = require("@vercel/blob");
const { Readable } = require("stream");

module.exports.config = {
  runtime: "nodejs",
  maxDuration: 300,
};

module.exports = async function handler(request, response) {
  const pathname = request.query.pathname;

  if (!pathname || typeof pathname !== "string") {
    response.status(400).send("Missing pathname.");
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    response.status(500).send("Missing BLOB_READ_WRITE_TOKEN.");
    return;
  }

  try {
    const result = await get(pathname, {
      access: "private",
      ifNoneMatch: request.headers["if-none-match"] ?? undefined,
    });

    if (!result) {
      response.status(404).send("Video not found.");
      return;
    }

    if (result.statusCode === 304) {
      response.setHeader("ETag", result.blob.etag);
      response.setHeader("Cache-Control", "private, no-cache");
      response.status(304).end();
      return;
    }

    response.setHeader("Content-Type", result.blob.contentType || "video/mp4");
    response.setHeader("ETag", result.blob.etag);
    response.setHeader("Content-Disposition", "inline");
    response.setHeader("Cache-Control", "private, no-cache");

    if (request.method === "HEAD" || !result.stream) {
      response.status(200).end();
      return;
    }

    response.statusCode = 200;
    Readable.fromWeb(result.stream).pipe(response);
  } catch (error) {
    response.status(500).send(error.message);
  }
};
