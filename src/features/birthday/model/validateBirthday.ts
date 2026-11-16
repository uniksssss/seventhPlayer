import type { BirthdayData, BirthdayErrors } from './birthday';

export function validateBirthday(data: BirthdayData): BirthdayErrors {
  const errors: BirthdayErrors = {};
  if (!data.photo) errors.photo = 'Добавьте фотографию игрока.';
  if (!data.firstName.trim()) errors.firstName = 'Укажите имя игрока.';
  else if (data.firstName.trim().length > 40) errors.firstName = 'Не больше 40 символов.';
  if (!data.lastName.trim()) errors.lastName = 'Укажите фамилию игрока.';
  else if (data.lastName.trim().length > 40) errors.lastName = 'Не больше 40 символов.';
  if (!data.playerNumber) errors.playerNumber = 'Укажите номер игрока.';
  else if (!/^\d{1,2}$/.test(data.playerNumber)) errors.playerNumber = 'Номер — число от 0 до 99.';
  return errors;
}
