import { getCoverCrop } from '../../../shared/lib/canvas';
import { downloadCanvasPng, loadImage } from '../../../shared/lib/images';
import { getStatsLayout, statLabels, formatStatValue } from '../model/matchStats';
import type { MatchStatsData, StatId } from '../model/matchStats';

export const POSTER_SIZE = 2160;
const GREEN = '#16503B';
const CREAM = '#F5F2E8';

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  width: number,
  style = '400',
) {
  ctx.font = `${style} ${size}px "Roboto Condensed"`;
  const measured = ctx.measureText(value).width;
  if (measured > width) ctx.font = `${style} ${(size * width) / measured}px "Roboto Condensed"`;
  ctx.fillText(value, x, y);
}

function logo(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  center: number,
  label: string,
) {
  if (image) {
    const scale = Math.min(310 / image.naturalWidth, 310 / image.naturalHeight);
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    ctx.drawImage(image, center - w / 2, 570 - h / 2, w, h);
  } else {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(center - 155, 415, 310, 310);
    text(ctx, label, center, 590, 42, 280);
    ctx.restore();
  }
}

export async function renderMatchStats(data: MatchStatsData): Promise<HTMLCanvasElement> {
  await Promise.all([
    document.fonts.load('400 100px "Roboto Condensed"', 'ОЧКИ ПРИЁМ АТАКА БЛОКИ ЭЙСЫ 0123456789'),
    document.fonts.load('600 100px "Roboto Condensed"', '0123456789'),
    document.fonts.load('italic 600 100px "Roboto Condensed"', 'Лучший игрок матча'),
    document.fonts.load(
      'italic 500 100px "Roboto Condensed"',
      `${data.firstName} ${data.lastName} очков`,
    ),
  ]);
  const [reference, home, away, photo] = await Promise.all([
    loadImage('/статистика.png'),
    data.homeLogo ? loadImage(data.homeLogo) : null,
    data.awayLogo ? loadImage(data.awayLogo) : null,
    data.showPlayer && data.photo ? loadImage(data.photo) : null,
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = POSTER_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Не удалось создать изображение.');
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, POSTER_SIZE, POSTER_SIZE);
  // Сохраняем исходный заголовок и декоративные элементы макета.
  ctx.drawImage(reference, 0, 0, 2160, 388, 0, 0, 2160, 388);
  for (const [x, y, w, h] of [
    [1830, 790, 300, 350],
    [0, 1380, 300, 260],
  ]) {
    ctx.drawImage(reference, x, y, w, h, x, y, w, h);
  }
  if (data.showPlayer) ctx.drawImage(reference, 1620, 1550, 500, 560, 1620, 1550, 500, 560);
  ctx.fillStyle = ctx.strokeStyle = GREEN;
  ctx.textAlign = 'center';
  logo(ctx, home, 500, 'Команда 1');
  logo(ctx, away, 1680, 'Команда 2');
  text(ctx, `${data.homeScore} : ${data.awayScore}`, 1080, 675, 280, 610, '600');
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(110, 763);
  ctx.lineTo(2050, 763);
  ctx.stroke();

  const layout = getStatsLayout(data.showPlayer);
  ctx.lineWidth = 2;
  (Object.entries(statLabels) as [StatId, string][]).forEach(([id, label], index) => {
    const y = layout.top + layout.rowHeight * (index + 0.5) + 38;
    text(ctx, formatStatValue(id, data.stats[id].home), 730, y, 120, 320);
    text(ctx, label.toLocaleUpperCase('ru'), 1080, y, 96, 420);
    text(ctx, formatStatValue(id, data.stats[id].away), 1450, y, 120, 320);
    if (index < 4) {
      const lineY = layout.top + layout.rowHeight * (index + 1);
      ctx.beginPath();
      ctx.moveTo(366, lineY);
      ctx.lineTo(1794, lineY);
      ctx.stroke();
    }
  });

  if (data.showPlayer) {
    if (photo) {
      const crop = getCoverCrop(
        photo.naturalWidth,
        photo.naturalHeight,
        348,
        414,
        data.photoX,
        data.photoY,
      );
      ctx.drawImage(photo, crop.x, crop.y, crop.width, crop.height, 54, 1746, 348, 414);
    } else {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.strokeRect(54, 1746, 348, 414);
      text(ctx, 'Фото игрока', 228, 1960, 44, 300);
      ctx.restore();
    }
    ctx.textAlign = 'left';
    text(ctx, 'Лучший игрок матча', 452, 1838, 96, 1100, 'italic 600');
    text(
      ctx,
      `${data.firstName.trim() || 'Имя'} ${data.lastName.trim() || 'Фамилия'}`,
      452,
      1974,
      96,
      1100,
      'italic 500',
    );
    ctx.fillStyle = '#FF003B';
    const points = Number(data.playerPoints);
    const noun =
      points % 100 >= 11 && points % 100 <= 14
        ? 'очков'
        : points % 10 === 1
          ? 'очко'
          : points % 10 >= 2 && points % 10 <= 4
            ? 'очка'
            : 'очков';
    text(ctx, `${data.playerPoints || '0'} ${noun}`, 452, 2070, 96, 1100, 'italic 500');
  }
  return canvas;
}

export async function exportMatchStats(data: MatchStatsData) {
  await downloadCanvasPng(await renderMatchStats(data), 'седьмой-игрок-статистика.png');
}
