import { getCoverCrop } from '../../../shared/lib/canvas';
import { downloadCanvasPng, loadImage } from '../../../shared/lib/images';
import type { MatchScoreData } from '../model/matchScore';

export const POSTER_SIZE = 2160;
const GREEN = '#16503B';
const CREAM = '#F5F2E8';

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  width: number,
  style = '600',
) {
  ctx.font = `${style} ${size}px "Roboto Condensed"`;
  const measured = ctx.measureText(text).width;
  if (measured > width) ctx.font = `${style} ${(size * width) / measured}px "Roboto Condensed"`;
  ctx.fillText(text, x, y);
}

function drawLogo(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  x: number,
  label: string,
) {
  const y = 1570;
  const width = 410;
  const height = 440;
  if (image) {
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    ctx.drawImage(image, x + (width - w) / 2, y + (height - h) / 2, w, h);
  } else {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(x, y + 30, width, height - 60);
    fitText(ctx, label, x + width / 2, y + height / 2, 42, width - 40);
    ctx.restore();
  }
}

// Превью и скачиваемый PNG используют один рендер.
export async function renderMatchScore(data: MatchScoreData): Promise<HTMLCanvasElement> {
  await Promise.all([
    document.fonts.load('600 100px "Roboto Condensed"', '0123456789 : Фотография Команда'),
    document.fonts.load('italic 600 100px "Roboto Condensed"', 'тур'),
  ]);
  const [photo, home, away, gradient, tour] = await Promise.all([
    data.photo ? loadImage(data.photo) : null,
    data.homeLogo ? loadImage(data.homeLogo) : null,
    data.awayLogo ? loadImage(data.awayLogo) : null,
    loadImage('/gradient.png'),
    loadImage('/tour.svg'),
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = POSTER_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Не удалось создать изображение.');
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, POSTER_SIZE, POSTER_SIZE);
  ctx.textAlign = 'center';
  if (photo) {
    const crop = getCoverCrop(
      photo.naturalWidth,
      photo.naturalHeight,
      POSTER_SIZE,
      POSTER_SIZE,
      data.photoX,
      data.photoY,
    );
    ctx.drawImage(photo, crop.x, crop.y, crop.width, crop.height, 0, 0, POSTER_SIZE, POSTER_SIZE);
  } else {
    ctx.fillStyle = '#D9DED8';
    ctx.fillRect(0, 0, POSTER_SIZE, 1600);
    ctx.fillStyle = GREEN;
    fitText(ctx, 'Фотография', 1080, 760, 70, 1800);
  }
  const gradientHeight = (POSTER_SIZE * gradient.naturalHeight) / gradient.naturalWidth;
  ctx.drawImage(gradient, 0, POSTER_SIZE - gradientHeight, POSTER_SIZE, gradientHeight);
  ctx.drawImage(tour, 1602, 24, 558, 208);
  ctx.fillStyle = CREAM;
  ctx.textAlign = 'right';
  fitText(ctx, `${data.round} тур`, 2110, 192, 128, 430, 'italic 600');

  ctx.textAlign = 'center';
  ctx.fillStyle = GREEN;
  drawLogo(ctx, home, 185, 'Команда 1');
  drawLogo(ctx, away, 1650, 'Команда 2');
  fitText(ctx, `${data.homeScore} : ${data.awayScore}`, 1120, 1880, 380, 800);
  fitText(
    ctx,
    data.sets.map((set) => `${set.home || '—'}:${set.away || '—'}`).join(' '),
    1120,
    2020,
    80,
    890,
  );
  return canvas;
}

export async function exportMatchScore(data: MatchScoreData) {
  await downloadCanvasPng(await renderMatchScore(data), 'седьмой-игрок-итог-матча.png');
}
