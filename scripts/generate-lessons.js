const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const videosDir = path.join(root, "videos");
const outputFile = path.join(root, "lessons.json");

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

const files = fs
  .readdirSync(videosDir)
  .filter((file) => file.toLowerCase().endsWith(".mp4"))
  .sort((a, b) => a.localeCompare(b, "ru", { numeric: true }))
  .map((file) => `videos/${file}`);

fs.writeFileSync(outputFile, `${JSON.stringify(files, null, 2)}\n`);
console.log(`Found ${files.length} video lesson(s).`);
