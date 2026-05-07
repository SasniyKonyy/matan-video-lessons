# Видео уроки

Одностраничный сайт для просмотра MP4-уроков из Vercel Blob прямо в браузере.

## Как добавить видео из Vercel Blob

1. Открой Vercel Dashboard.
2. Перейди в Storage -> Blob.
3. Загрузи туда `.mp4`.
4. Сайт сам получит список MP4 через `/api/lessons`.

В Vercel проект должен быть подключен к Blob store, чтобы в переменных среды был `BLOB_READ_WRITE_TOKEN`.

## Запуск

Локально:

```bash
npm run build
```

Для Vercel:

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `.`
