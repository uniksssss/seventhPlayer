export interface BirthdayData {
  firstName: string;
  lastName: string;
  playerNumber: string;
  photo: string | null;
  photoX: number;
  photoY: number;
}

export const initialBirthday: BirthdayData = {
  firstName: '',
  lastName: '',
  playerNumber: '1',
  photo: null,
  photoX: 50,
  photoY: 50,
};

export type BirthdayField = 'firstName' | 'lastName' | 'playerNumber' | 'photo';
export type BirthdayErrors = Partial<Record<BirthdayField, string>>;
export type BirthdayChange = <K extends keyof BirthdayData>(
  field: K,
  value: BirthdayData[K],
) => void;
