import type { MatchScoreData } from './matchScore';

export type MatchScoreErrors = Partial<
  Record<keyof MatchScoreData | `set-${number}-${'home' | 'away'}`, string>
>;

export function validateMatchScore(data: MatchScoreData): MatchScoreErrors {
  const errors: MatchScoreErrors = {};
  if (!data.photo) errors.photo = 'Добавьте фотографию.';
  if (!['superleague', 'major-a'].includes(data.league)) errors.league = 'Выберите лигу.';
  if (!/^\d{1,2}$/.test(data.round) || Number(data.round) < 1)
    errors.round = 'Тур — число от 1 до 99.';
  if (!data.homeLogo) errors.homeLogo = 'Добавьте логотип первой команды.';
  if (!data.awayLogo) errors.awayLogo = 'Добавьте логотип второй команды.';
  for (const field of ['homeScore', 'awayScore'] as const) {
    if (!/^[0-3]$/.test(data[field])) errors[field] = 'Выберите счёт от 0 до 3.';
  }
  if (data.sets.length < 3 || data.sets.length > 5) errors.sets = 'Добавьте от 3 до 5 партий.';
  data.sets.forEach((set, index) => {
    for (const side of ['home', 'away'] as const) {
      if (!/^\d{1,2}$/.test(set[side]))
        errors[`set-${index}-${side}`] = 'Укажите число от 0 до 99.';
    }
  });
  return errors;
}
