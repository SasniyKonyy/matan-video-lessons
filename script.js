const lessonsGrid = document.querySelector("#lessonsGrid");
const videoPlayer = document.querySelector("#videoPlayer");
const currentTitle = document.querySelector("#currentTitle");
const emptyPlayer = document.querySelector("#emptyPlayer");
const lessonCount = document.querySelector("#lessonCount");

const cleanTitle = (filename) =>
  filename
    .replace(/^.*\//, "")
    .replace(/\.mp4$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const makeVideoUrl = (filename) =>
  filename
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

const setActiveLesson = (lesson, button) => {
  document.querySelectorAll(".lesson-card").forEach((card) => {
    card.classList.remove("is-active");
  });

  button.classList.add("is-active");
  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();
  videoPlayer.src = lesson.src;
  videoPlayer.load();
  videoPlayer.play().catch(() => {});
  currentTitle.textContent = lesson.title;
  emptyPlayer.classList.add("is-hidden");
};

const renderLessons = (lessons) => {
  lessonCount.textContent = lessons.length;
  lessonsGrid.innerHTML = "";

  if (!lessons.length) {
    lessonsGrid.innerHTML =
      '<div class="empty-list">Пока нет уроков. Положи MP4-файлы в папку videos и запусти сборку заново.</div>';
    return;
  }

  lessons.forEach((lesson, index) => {
    const button = document.createElement("button");
    button.className = "lesson-card";
    button.type = "button";

    const title = document.createElement("h3");
    title.textContent = lesson.title;

    const number = document.createElement("span");
    number.textContent = `Урок ${index + 1}`;

    button.append(title, number);
    button.addEventListener("click", () => setActiveLesson(lesson, button));
    lessonsGrid.append(button);

    if (index === 0) {
      setActiveLesson(lesson, button);
    }
  });
};

fetch("lessons.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Не удалось загрузить lessons.json");
    }
    return response.json();
  })
  .then((files) => {
    const lessons = files.map((file) => ({
      title: cleanTitle(file),
      src: makeVideoUrl(file),
    }));
    renderLessons(lessons);
  })
  .catch(() => {
    renderLessons([]);
  });
