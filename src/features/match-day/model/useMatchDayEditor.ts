import { useState } from 'react';
import { initialMatchDay } from './matchDay';
import { teamLogosByLeague } from './teamLogos';
import { selectTeamLogo } from './teamSelection';
import type {
  LeagueId,
  TeamLogo,
  MatchDayData,
  MatchDayChange,
  MatchDayImageField,
} from './matchDay';
import { validateMatchDay } from './validateMatchDay';
import type { MatchDayErrors } from './validateMatchDay';
import { readImage } from '../../../shared/lib/images';
import { exportMatchDay } from '../services/matchDayService';

export function useMatchDayEditor() {
  const [data, setData] = useState<MatchDayData>(initialMatchDay);
  const [customLogos, setCustomLogos] = useState<Record<LeagueId, TeamLogo[]>>({
    superleague: [],
    'major-a': [],
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<MatchDayErrors>({});
  const fieldErrors = { ...(submitted ? validateMatchDay(data) : {}), ...uploadErrors };
  const logos = [...teamLogosByLeague[data.league], ...customLogos[data.league]];

  const update: MatchDayChange = (key, value) => {
    setData((previous) => ({ ...previous, [key]: value }));
  };

  async function upload(file: File | undefined, target: MatchDayImageField) {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const src = await readImage(file);
      setUploadErrors((previous) => {
        const next = { ...previous };
        delete next[target];
        return next;
      });
      if (target === 'photo') {
        setData((previous) => ({ ...previous, photo: src, photoX: 50, photoY: 50 }));
      } else {
        const logo = {
          id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          src,
        };
        setCustomLogos((previous) => ({
          ...previous,
          [data.league]: [...previous[data.league], logo],
        }));
        selectLogo(target, src);
      }
    } catch (reason) {
      setUploadErrors((previous) => ({
        ...previous,
        [target]: reason instanceof Error ? reason.message : 'Не удалось загрузить изображение.',
      }));
    } finally {
      setUploading(false);
    }
  }

  async function save(): Promise<'invalid' | 'saved' | 'busy' | 'error'> {
    if (saving) return 'busy';
    setError('');
    if (uploading) {
      setError('Дождитесь загрузки изображения.');
      return 'busy';
    }
    setSubmitted(true);
    const errors = { ...validateMatchDay(data), ...uploadErrors };
    if (Object.keys(errors).length) {
      return 'invalid';
    }
    setSaving(true);
    setError('');
    try {
      await exportMatchDay(data);
      return 'saved';
    } catch {
      setError('Не удалось сохранить картинку. Попробуйте ещё раз.');
      return 'error';
    } finally {
      setSaving(false);
    }
  }

  function changeLeague(league: LeagueId) {
    setData((previous) => ({ ...previous, league, homeLogo: null, awayLogo: null }));
  }

  function selectLogo(target: 'homeLogo' | 'awayLogo', src: string | null) {
    setData((previous) =>
      selectTeamLogo(previous, target, src, teamLogosByLeague[previous.league]),
    );
    setUploadErrors((previous) => {
      const next = { ...previous };
      delete next[target];
      if (target === 'homeLogo') delete next.awayLogo;
      return next;
    });
  }

  return {
    data,
    logos,
    fieldErrors,
    error,
    uploading,
    saving,
    update,
    changeLeague,
    selectLogo,
    upload,
    save,
  };
}
