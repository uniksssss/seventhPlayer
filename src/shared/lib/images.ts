export async function readImage(file: File): Promise<string> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('Выберите изображение PNG, JPG или WebP.');
  }
  if (file.size > 20 * 1024 * 1024)
    throw new Error('Изображение слишком большое. Максимум — 20 МБ.');
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Не удалось прочитать файл.'));
    reader.readAsDataURL(file);
  });
  try {
    await loadImage(source);
  } catch {
    throw new Error('Не удалось открыть изображение. Попробуйте другой файл.');
  }
  return source;
}

export function publicAssetUrl(src: string): string {
  return src.startsWith('/') && !src.startsWith('//')
    ? `${import.meta.env.BASE_URL}${src.slice(1)}`
    : src;
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = publicAssetUrl(src);
  await image.decode();
  return image;
}

export const PNG_EXPORT_EVENT = 'poster:export-png';

export function downloadPngFile(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  // Если браузер откроет PNG вместо скачивания, редактор останется в своей вкладке.
  link.target = '_blank';
  link.rel = 'noopener';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string) {
  let blob: Blob;
  try {
    blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('Не удалось сохранить PNG.'))),
        'image/png',
      );
    });
  } finally {
    // Освобождаем буфер экспортного canvas, особенно важный для Safari на iOS.
    canvas.width = canvas.height = 0;
  }
  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches) {
    // Системное меню открывается отдельным нажатием после готовности PNG,
    // чтобы асинхронный рендер не потерял разрешение на действие пользователя.
    window.dispatchEvent(new CustomEvent<File>(PNG_EXPORT_EVENT, { detail: file }));
    return;
  }
  downloadPngFile(file);
}
