const { head } = require("@vercel/blob");
const { Readable } = require("stream");

const CHUNK_SIZE = 4 * 1024 * 1024;

module.exports.config = {
  runtime: "nodejs",
  maxDuration: 300,
};

const parseRange = (rangeHeader, size) => {
  if (!rangeHeader) {
    return { start: 0, end: Math.min(CHUNK_SIZE - 1, size - 1) };
  }

  const match = rangeHeader.match(/^bytes=(\d*)-(\d*)$/);

  if (!match) {
    return null;
  }

  const start = match[1] ? Number(match[1]) : 0;
  const requestedEnd = match[2] ? Number(match[2]) : size - 1;
  const end = Math.min(requestedEnd, start + CHUNK_SIZE - 1, size - 1);

  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) {
    return null;
  }

  return { start, end };
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
    const size = blob.size;
    const range = parseRange(request.headers.range, size);

    if (!range) {
      response
        .status(416)
        .setHeader("Content-Range", `bytes */${size}`)
        .end();
      return;
    }

    const sourceUrl = blob.downloadUrl || blob.url;
    const upstream = await fetch(sourceUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        Range: `bytes=${range.start}-${range.end}`,
      },
    });

    if (!upstream.ok && upstream.status !== 206) {
      response.status(upstream.status).send(await upstream.text());
      return;
    }

    response.statusCode = 206;
    response.setHeader("Accept-Ranges", "bytes");
    response.setHeader("Content-Type", blob.contentType || "video/mp4");
    response.setHeader("Content-Length", String(range.end - range.start + 1));
    response.setHeader("Content-Range", `bytes ${range.start}-${range.end}/${size}`);
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
