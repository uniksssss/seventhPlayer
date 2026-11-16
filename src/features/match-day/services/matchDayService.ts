import { getCoverCrop } from '../../../shared/lib/canvas';
import { downloadCanvasPng, loadImage } from '../../../shared/lib/images';
import { leagues } from '../model/matchDay';
import type { MatchDayData } from '../model/matchDay';

export const POSTER_SIZE = 2160;
const GREEN = '#16503B';
const CREAM = '#F5F2E8';

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  maxWidth: number,
  style = '400',
) {
  ctx.font = `${style} ${size}px "Roboto Condensed"`;
  const width = ctx.measureText(text).width;
  if (width > maxWidth) ctx.font = `${style} ${(size * maxWidth) / width}px "Roboto Condensed"`;
  ctx.fillText(text, x, y);
}

function drawLogo(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  x: number,
  y: number,
  label: string,
) {
  const width = 360;
  const height = 390;
  if (image) {
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    ctx.drawImage(image, x + (width - w) / 2, y + (height - h) / 2, w, h);
  } else {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(x + 25, y + 50, width - 50, height - 100);
    ctx.textAlign = 'center';
    fitText(ctx, label, x + width / 2, y + height / 2 + 15, 42, width - 60);
    ctx.restore();
  }
}

// Единый рендер для превью и PNG: одинаковые шрифты, координаты и кадрирование.
export async function renderMatchDay(data: MatchDayData): Promise<HTMLCanvasElement> {
  await Promise.all([
    document.fonts.load('400 100px "Roboto Condensed"', 'Екатеринбург 0123456789 / : «А»'),
    document.fonts.load('italic 600 100px "Roboto Condensed"', 'ДЕНЬ МАТЧА'),
    document.fonts.load('italic 500 100px "Roboto Condensed"', 'vs'),
  ]);
  const [photo, home, away, brand] = await Promise.all([
    data.photo ? loadImage(data.photo) : null,
    data.homeLogo ? loadImage(data.homeLogo) : null,
    data.awayLogo ? loadImage(data.awayLogo) : null,
    loadImage(data.theme === 'dark' ? '/лого строка светлый.png' : '/лого строка.png'),
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = POSTER_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Не удалось создать изображение.');
  const foreground = data.theme === 'light' ? GREEN : CREAM;
  ctx.fillStyle = data.theme === 'light' ? CREAM : GREEN;
  ctx.fillRect(0, 0, POSTER_SIZE, POSTER_SIZE);
  ctx.fillStyle = ctx.strokeStyle = foreground;
  ctx.imageSmoothingQuality = 'high';

  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(1510, 0);
  ctx.lineTo(1649, 302);
  ctx.lineTo(2160, 72);
  ctx.stroke();
  ctx.setLineDash([21, 21]);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(1545, 69);
  ctx.bezierCurveTo(1700, 0, 1840, 78, 1905, 186);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(688, 2148);
  ctx.bezierCurveTo(940, 1930, 1220, 2030, 1440, 2110);
  ctx.bezierCurveTo(1680, 2240, 1990, 2190, 2160, 2085);
  ctx.stroke();
  ctx.setLineDash([]);

  fitText(ctx, 'ДЕНЬ МАТЧА', 82, 352, 260, 1425, 'italic 600');
  // Правый край фиксирован независимо от количества цифр тура.
  ctx.textAlign = 'right';
  fitText(ctx, data.round ? `${data.round} тур` : 'тур', 2090, 382, 128, 470);
  ctx.textAlign = 'left';

  if (!photo) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 14]);
    ctx.strokeRect(82, 428, 2008, 1070);
    ctx.textAlign = 'center';
    fitText(ctx, 'Фотография', 1086, 980, 64, 1800);
    ctx.restore();
  } else {
    const crop = getCoverCrop(
      photo.naturalWidth,
      photo.naturalHeight,
      2008,
      1070,
      data.photoX,
      data.photoY,
    );
    ctx.drawImage(photo, crop.x, crop.y, crop.width, crop.height, 82, 428, 2008, 1070);
  }

  const date = data.date ? `${data.date.slice(8, 10)}.${data.date.slice(5, 7)}` : 'ДД.ММ';
  fitText(ctx, `${date} / ${data.time || 'ЧЧ:ММ'}`, 88, 1758, 190, 1020);
  fitText(ctx, data.venue, 88, 1970, 128, 1090);
  fitText(ctx, leagues[data.league], 90, 2077, 80, 1020);
  drawLogo(ctx, home, 1240, 1575, 'Команда 1');
  drawLogo(ctx, away, 1735, 1575, 'Команда 2');
  ctx.textAlign = 'center';
  fitText(ctx, 'vs', 1660, 1815, 100, 120, 'italic 500');
  ctx.textAlign = 'left';

  // В исходнике вокруг логотипа есть прозрачные поля.
  ctx.drawImage(
    brand,
    (brand.naturalWidth * 20) / 1177,
    (brand.naturalHeight * 182) / 600,
    (brand.naturalWidth * 1080) / 1177,
    (brand.naturalHeight * 265) / 600,
    1880,
    2010,
    220,
    54,
  );
  return canvas;
}

export async function exportMatchDay(data: MatchDayData) {
  await downloadCanvasPng(await renderMatchDay(data), 'седьмой-игрок-день-матча.png');
}
