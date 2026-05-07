const { head } = require("@vercel/blob");
const { Readable } = require("stream");

const copyHeader = (source, target, name) => {
  const value = source.headers.get(name);

  if (value) {
    target.setHeader(name, value);
  }
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
    const blob = await head(pathname, { access: "private" });
    const blobUrl = blob.url || blob.downloadUrl;

    if (!blobUrl) {
      response.status(404).send("Video not found.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
    };

    if (request.headers.range) {
      headers.Range = request.headers.range;
    }

    if (request.headers["if-none-match"]) {
      headers["If-None-Match"] = request.headers["if-none-match"];
    }

    const upstream = await fetch(blobUrl, { headers });

    response.statusCode = upstream.status;
    copyHeader(upstream, response, "content-type");
    copyHeader(upstream, response, "content-length");
    copyHeader(upstream, response, "content-range");
    copyHeader(upstream, response, "accept-ranges");
    copyHeader(upstream, response, "etag");
    copyHeader(upstream, response, "last-modified");
    response.setHeader("Content-Disposition", "inline");
    response.setHeader("Cache-Control", "private, no-cache");

    if (request.method === "HEAD" || !upstream.body) {
      response.end();
      return;
    }

    Readable.fromWeb(upstream.body).pipe(response);
  } catch (error) {
    response.status(500).send(error.message);
  }
};
