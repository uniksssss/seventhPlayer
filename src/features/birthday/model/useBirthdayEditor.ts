import { readImage } from '../../../shared/lib/images';
import { useState } from 'react';
import { initialBirthday } from './birthday';
import type { BirthdayChange } from './birthday';
import { validateBirthday } from './validateBirthday';
import { exportBirthday } from '../services/birthdayService';

export function useBirthdayEditor() {
  const [data, setData] = useState(initialBirthday);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [error, setError] = useState('');
  const errors = {
    ...(submitted ? validateBirthday(data) : {}),
    ...(uploadError ? { photo: uploadError } : {}),
  };

  const update: BirthdayChange = (field, value) => {
    setData((previous) => ({ ...previous, [field]: value }));
  };

  async function save(): Promise<'invalid' | 'saved' | 'busy' | 'error'> {
    if (saving) return 'busy';
    setError('');
    if (uploading) {
      setError('Дождитесь загрузки фотографии.');
      return 'busy';
    }
    setSubmitted(true);
    if (uploadError || Object.keys(validateBirthday(data)).length) return 'invalid';
    setSaving(true);
    try {
      await exportBirthday(data);
      return 'saved';
    } catch {
      setError('Не удалось сохранить картинку. Попробуйте ещё раз.');
      return 'error';
    } finally {
      setSaving(false);
    }
  }

  async function uploadPhoto(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const photo = await readImage(file);
      setData((previous) => ({ ...previous, photo, photoX: 50, photoY: 50 }));
      setUploadError('');
    } catch (reason) {
      setUploadError(reason instanceof Error ? reason.message : 'Не удалось загрузить фотографию.');
    } finally {
      setUploading(false);
    }
  }

  return { data, errors, error, saving, uploading, update, uploadPhoto, save };
}
