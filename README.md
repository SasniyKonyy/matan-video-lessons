# Видео уроки

Одностраничный сайт для просмотра MP4-уроков из Vercel Blob прямо в браузере.

## Как добавить видео из Vercel Blob

1. Открой Vercel Dashboard.
2. Перейди в Storage -> Blob.
3. Открой загруженное видео и скопируй его публичную ссылку.
4. Добавь ссылку в `lessons.json`.

Пример:

```json
[
  {
    "title": "Отношение отрезков, пункт а",
    "src": "https://example.public.blob.vercel-storage.com/video.mp4"
  }
]
```

Можно добавлять сколько угодно уроков:

```json
[
  {
    "title": "Урок 1",
    "src": "https://example.public.blob.vercel-storage.com/lesson-1.mp4"
  },
  {
    "title": "Урок 2",
    "src": "https://example.public.blob.vercel-storage.com/lesson-2.mp4"
  }
]
```

## Запуск

Локально:

```bash
npm run build
```

Для Vercel:

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `.`
