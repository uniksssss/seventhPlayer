import type { LeagueId, MatchDayImageField } from '../../match-day/model/matchDay';

export interface SetScore {
  home: string;
  away: string;
}

export interface MatchScoreData {
  round: string;
  league: LeagueId;
  photo: string | null;
  photoX: number;
  photoY: number;
  homeLogo: string | null;
  awayLogo: string | null;
  homeScore: string;
  awayScore: string;
  sets: SetScore[];
}

export const initialMatchScore: MatchScoreData = {
  round: '7',
  league: 'superleague',
  photo: null,
  photoX: 50,
  photoY: 50,
  homeLogo: null,
  awayLogo: null,
  homeScore: '3',
  awayScore: '0',
  sets: [
    { home: '25', away: '17' },
    { home: '25', away: '19' },
    { home: '25', away: '12' },
  ],
};

export type MatchScoreChange = <K extends keyof MatchScoreData>(
  key: K,
  value: MatchScoreData[K],
) => void;
export type MatchScoreUpload = (
  file: File | undefined,
  target: MatchDayImageField,
) => Promise<void>;

export function resizeSets(sets: SetScore[], count: number): SetScore[] {
  const length = Math.max(3, Math.min(5, Math.trunc(count) || 1));
  return Array.from({ length }, (_, index) => sets[index] ?? { home: '', away: '' });
}
