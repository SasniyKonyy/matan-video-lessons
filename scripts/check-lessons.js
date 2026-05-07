const fs = require("fs");
const path = require("path");

const lessonsFile = path.join(__dirname, "..", "lessons.json");

if (!fs.existsSync(lessonsFile)) {
  fs.writeFileSync(lessonsFile, "[]\n");
}

const lessons = JSON.parse(fs.readFileSync(lessonsFile, "utf8"));

if (!Array.isArray(lessons)) {
  throw new Error("lessons.json must contain an array.");
}

const broken = lessons.filter((lesson) => {
  if (typeof lesson === "string") {
    return !lesson.trim();
  }

  return !lesson || typeof lesson.src !== "string" || !lesson.src.trim();
});

if (broken.length) {
  throw new Error("Each lesson must be a URL string or an object with a src field.");
}

console.log(`Configured ${lessons.length} video lesson(s).`);
