# Видео уроки

Одностраничный сайт для просмотра MP4-уроков из публичного Vercel Blob прямо в браузере.

## Как добавить видео из Vercel Blob

1. Открой Vercel Dashboard.
2. Перейди в Storage -> Blob.
3. Загрузи туда `.mp4`.
4. Сайт сам получит список MP4 через `/api/lessons`.

Blob store должен быть публичным. Тогда сайт получает список файлов через `/api/lessons`, а видео проигрываются напрямую по `public.blob.vercel-storage.com` ссылкам.

## Запуск

Локально:

```bash
npm run build
```

Для Vercel:

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `.`
