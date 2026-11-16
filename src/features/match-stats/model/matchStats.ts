import type { LeagueId, MatchDayImageField } from '../../match-day/model/matchDay';

export const statLabels = {
  points: 'Очки',
  reception: 'Приём',
  attack: 'Атака',
  blocks: 'Блоки',
  aces: 'Эйсы',
} as const;
export type StatId = keyof typeof statLabels;

export function normalizeStatInput(value: string) {
  return value.replace(/[^0-9.,]/g, '').replace(/^0+(?=\d)/, '');
}

export function formatStatValue(id: StatId, value: string) {
  return `${value || '—'}${id === 'reception' || id === 'attack' ? '%' : ''}`;
}
export interface MatchStatsData {
  league: LeagueId;
  homeLogo: string | null;
  awayLogo: string | null;
  homeScore: string;
  awayScore: string;
  stats: Record<StatId, { home: string; away: string }>;
  showPlayer: boolean;
  photo: string | null;
  photoX: number;
  photoY: number;
  firstName: string;
  lastName: string;
  playerPoints: string;
}
export const initialMatchStats: MatchStatsData = {
  league: 'superleague',
  homeLogo: null,
  awayLogo: null,
  homeScore: '3',
  awayScore: '1',
  stats: {
    points: { home: '0', away: '0' },
    reception: { home: '0', away: '0' },
    attack: { home: '0', away: '0' },
    blocks: { home: '0', away: '0' },
    aces: { home: '0', away: '0' },
  },
  showPlayer: true,
  photo: null,
  photoX: 50,
  photoY: 50,
  firstName: '',
  lastName: '',
  playerPoints: '0',
};
export type MatchStatsChange = <K extends keyof MatchStatsData>(
  key: K,
  value: MatchStatsData[K],
) => void;
export type MatchStatsUpload = (
  file: File | undefined,
  target: MatchDayImageField,
) => Promise<void>;

export function getStatsLayout(showPlayer: boolean) {
  const top = 790;
  const bottom = showPlayer ? 1660 : 2070;
  return { top, bottom, rowHeight: (bottom - top) / 5 };
}
