import type { MatchStatsData, StatId } from './matchStats';

export type MatchStatsErrors = Partial<
  Record<keyof MatchStatsData | `${StatId}-${'home' | 'away'}`, string>
>;
export function validateMatchStats(data: MatchStatsData): MatchStatsErrors {
  const errors: MatchStatsErrors = {};
  if (!data.homeLogo) errors.homeLogo = 'Добавьте логотип первой команды.';
  if (!data.awayLogo) errors.awayLogo = 'Добавьте логотип второй команды.';
  for (const field of ['homeScore', 'awayScore'] as const) {
    if (!/^[0-3]$/.test(data[field])) errors[field] = 'Выберите счёт от 0 до 3.';
  }
  for (const id of ['points', 'reception', 'attack', 'blocks', 'aces'] as const) {
    for (const side of ['home', 'away'] as const) {
      if (!/^\d{1,3}([.,]\d{1,2})?$/.test(data.stats[id][side]))
        errors[`${id}-${side}`] = 'Укажите число от 0 до 999,99.';
    }
  }
  if (data.showPlayer) {
    if (!data.photo) errors.photo = 'Добавьте фото лучшего игрока.';
    for (const field of ['firstName', 'lastName'] as const) {
      if (!data[field].trim())
        errors[field] = field === 'firstName' ? 'Укажите имя.' : 'Укажите фамилию.';
      else if (data[field].trim().length > 40) errors[field] = 'Не больше 40 символов.';
    }
    if (!/^\d{1,3}$/.test(data.playerPoints)) errors.playerPoints = 'Укажите число от 0 до 999.';
  }
  return errors;
}
