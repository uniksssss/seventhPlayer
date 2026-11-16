import { getCoverCrop } from '../../../shared/lib/canvas';
import { downloadCanvasPng, loadImage } from '../../../shared/lib/images';
import type { BirthdayData } from '../model/birthday';

export const BIRTHDAY_POSTER_SIZE = 2160;
const GREEN = '#16503B';
const CREAM = '#F5F2E8';

/** В плоском референсе очищаем зелёные подписи, сохраняя красный декор. */
function clearReferenceText(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const region = ctx.getImageData(x, y, width, height);
  for (let i = 0; i < region.data.length; i += 4) {
    const r = region.data[i];
    const g = region.data[i + 1];
    const b = region.data[i + 2];
    if (g > r && g > b) {
      region.data[i] = 245;
      region.data[i + 1] = 242;
      region.data[i + 2] = 232;
      region.data[i + 3] = 255;
    }
  }
  ctx.putImageData(region, x, y);
}

// Статические элементы референса остаются неизменными. Превью и PNG используют один рендер.
export async function renderBirthday(data: BirthdayData): Promise<HTMLCanvasElement> {
  await Promise.all([
    document.fonts.load(
      '600 190px "Roboto Condensed"',
      `${data.firstName}${data.lastName}ИМЯ ФАМИЛИЯ`,
    ),
    document.fonts.load('400 190px "Roboto Condensed"', '#0123456789Фотография'),
  ]);
  const [reference, photo] = await Promise.all([
    loadImage('/день рождения.png'),
    data.photo ? loadImage(data.photo) : null,
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = BIRTHDAY_POSTER_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Не удалось создать изображение.');
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(reference, 0, 0, canvas.width, canvas.height);
  clearReferenceText(ctx, 120, 1770, 1320, 205);
  clearReferenceText(ctx, 1710, 1560, 390, 340);

  // В референсе красные штрихи заходят на фото. Выделяем их до замены изображения.
  const decoration = ctx.getImageData(1500, 780, 130, 280);
  for (let i = 0; i < decoration.data.length; i += 4) {
    const r = decoration.data[i];
    const g = decoration.data[i + 1];
    const b = decoration.data[i + 2];
    if (!(r > 180 && g < 80 && b > 35)) decoration.data[i + 3] = 0;
  }
  const overlay = document.createElement('canvas');
  overlay.width = 130;
  overlay.height = 280;
  const overlayContext = overlay.getContext('2d');
  if (!overlayContext) throw new Error('Не удалось подготовить декор.');
  overlayContext.putImageData(decoration, 0, 0);

  ctx.fillStyle = CREAM;
  ctx.fillRect(144, 676, 1486, 1020);
  if (photo) {
    const crop = getCoverCrop(
      photo.naturalWidth,
      photo.naturalHeight,
      1486,
      1020,
      data.photoX,
      data.photoY,
    );
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(photo, crop.x, crop.y, crop.width, crop.height, 144, 676, 1486, 1020);
  } else {
    ctx.save();
    ctx.strokeStyle = ctx.fillStyle = GREEN;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 14]);
    ctx.strokeRect(144, 676, 1486, 1020);
    ctx.font = '400 60px "Roboto Condensed"';
    ctx.textAlign = 'center';
    ctx.fillText('Фотография', 887, 1186);
    ctx.restore();
  }
  ctx.drawImage(overlay, 1500, 780);

  ctx.fillStyle = GREEN;
  const name =
    `${data.firstName.trim() || 'Имя'} ${data.lastName.trim() || 'Фамилия'}`.toLocaleUpperCase(
      'ru',
    );
  ctx.font = '600 190px "Roboto Condensed"';
  const nameWidth = ctx.measureText(name).width;
  if (nameWidth > 1280) ctx.font = `600 ${(190 * 1280) / nameWidth}px "Roboto Condensed"`;
  ctx.fillText(name, 140, 1942);

  ctx.save();
  ctx.translate(1875, 1755);
  ctx.rotate((-18 * Math.PI) / 180);
  ctx.font = '400 190px "Roboto Condensed"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`#${data.playerNumber || '?'}`, 0, 0, 270);
  ctx.restore();
  return canvas;
}

export async function exportBirthday(data: BirthdayData) {
  await downloadCanvasPng(await renderBirthday(data), 'седьмой-игрок-с-днём-рождения.png');
}
