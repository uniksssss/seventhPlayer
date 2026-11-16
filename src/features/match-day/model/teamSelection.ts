import type { TeamLogo } from './matchDay';

/** Автоподстановка действует только при изменении первой команды. */
export function selectTeamLogo<T extends { homeLogo: string | null; awayLogo: string | null }>(
  data: T,
  target: 'homeLogo' | 'awayLogo',
  src: string | null,
  leagueLogos: readonly TeamLogo[],
): T {
  if (target === 'awayLogo') return { ...data, awayLogo: src };

  const uralochka = leagueLogos.find((logo) => logo.id === 'uralochka');
  return {
    ...data,
    homeLogo: src,
    awayLogo: src && src !== uralochka?.src ? (uralochka?.src ?? null) : null,
  };
}
