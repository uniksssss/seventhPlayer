import type { MatchDayData } from './matchDay';

export type MatchDayField =
  'photo' | 'league' | 'round' | 'date' | 'time' | 'venue' | 'homeLogo' | 'awayLogo';
export type MatchDayErrors = Partial<Record<MatchDayField, string>>;

export function validateMatchDay(data: MatchDayData): MatchDayErrors {
  const errors: MatchDayErrors = {};
  if (!data.photo) errors.photo = 'Добавьте фотографию.';
  if (!['superleague', 'major-a'].includes(data.league)) errors.league = 'Выберите лигу.';
  if (!data.round) errors.round = 'Укажите тур.';
  else if (!/^\d{1,2}$/.test(data.round) || Number(data.round) < 1)
    errors.round = 'Тур — число от 1 до 99.';

  if (!data.date) errors.date = 'Укажите дату матча.';
  else {
    const parsed = new Date(`${data.date}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
      data.date.startsWith('0000') ||
      !Number.isFinite(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== data.date
    ) {
      errors.date = 'Укажите существующую дату.';
    }
  }
  if (!data.time) errors.time = 'Укажите время матча.';
  else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time))
    errors.time = 'Укажите время от 00:00 до 23:59.';
  if (!data.venue.trim()) errors.venue = 'Укажите место проведения.';
  else if (data.venue.trim().length > 80) errors.venue = 'Не больше 80 символов.';
  if (!data.homeLogo) errors.homeLogo = 'Добавьте логотип первой команды.';
  if (!data.awayLogo) errors.awayLogo = 'Добавьте логотип второй команды.';
  return errors;
}
