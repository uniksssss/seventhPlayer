export type LeagueId = 'superleague' | 'major-a';
export type PosterTheme = 'light' | 'dark';

export const leagues: Record<LeagueId, string> = {
  superleague: 'Суперлига',
  'major-a': 'Высшая лига «А»',
};

export interface TeamLogo {
  id: string;
  name: string;
  src: string;
}

export interface MatchDayData {
  round: string;
  date: string;
  time: string;
  venue: string;
  league: LeagueId;
  theme: PosterTheme;
  photo: string | null;
  photoX: number;
  photoY: number;
  homeLogo: string | null;
  awayLogo: string | null;
}

export const initialMatchDay: MatchDayData = {
  round: '8',
  date: '2026-10-24',
  time: '18:30',
  venue: 'Екатеринбург',
  league: 'superleague',
  theme: 'light',
  photo: null,
  photoX: 50,
  photoY: 50,
  homeLogo: null,
  awayLogo: null,
};

export type MatchDayImageField = 'photo' | 'homeLogo' | 'awayLogo';
export type MatchDayChange = <K extends keyof MatchDayData>(key: K, value: MatchDayData[K]) => void;
export type MatchDayUpload = (file: File | undefined, target: MatchDayImageField) => Promise<void>;
