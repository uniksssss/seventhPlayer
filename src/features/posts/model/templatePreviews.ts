import type { PostTemplateId } from './templates';

// Условные превью для выбора категории; заменим их согласованными макетами.
export const templatePreviews: Record<
  PostTemplateId,
  { heading: string; detail: string; light?: boolean }
> = {
  'match-day': { heading: 'МАТЧ\nДЕНЬ', detail: 'УРАЛОЧКА · СОПЕРНИК' },
  birthday: { heading: 'С ДНЁМ\nРОЖДЕНИЯ!', detail: 'ИМЯ ИГРОКА', light: true },
  'thank-you': { heading: 'СПАСИБО\nЗА ИГРУ', detail: 'МЫ С ВАМИ' },
  holiday: { heading: 'С ПРАЗДНИКОМ!', detail: 'СЕДЬМОЙ ИГРОК', light: true },
  welcome: { heading: 'ДОБРО\nПОЖАЛОВАТЬ', detail: 'В НАШУ КОМАНДУ' },
  'match-score': { heading: '3 : 1', detail: 'ИТОГ МАТЧА' },
  'match-stats': { heading: '24 / 8 / 5', detail: 'СТАТИСТИКА ИГРЫ', light: true },
  custom: { heading: 'ВАШ\nЗАГОЛОВОК', detail: 'СЕДЬМОЙ ИГРОК', light: true },
};
