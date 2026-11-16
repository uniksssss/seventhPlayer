import { useState } from 'react';
import { initialMatchStats } from './matchStats';
import type { MatchStatsData, MatchStatsChange } from './matchStats';
import { selectTeamLogo } from '../../match-day/model/teamSelection';
import { teamLogosByLeague } from '../../match-day/model/teamLogos';
import type { LeagueId, TeamLogo, MatchDayImageField } from '../../match-day/model/matchDay';
import { validateMatchStats } from './validateMatchStats';
import type { MatchStatsErrors } from './validateMatchStats';
import { readImage } from '../../../shared/lib/images';
import { exportMatchStats } from '../services/matchStatsService';

export function useMatchStatsEditor() {
  const [data, setData] = useState<MatchStatsData>(initialMatchStats);
  const [customLogos, setCustomLogos] = useState<Record<LeagueId, TeamLogo[]>>({
    superleague: [],
    'major-a': [],
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<MatchStatsErrors>({});
  const fieldErrors = { ...(submitted ? validateMatchStats(data) : {}), ...uploadErrors };
  if (!data.showPlayer) delete fieldErrors.photo;
  const logos = (Object.keys(teamLogosByLeague) as LeagueId[]).flatMap((league) =>
    [...teamLogosByLeague[league], ...customLogos[league]].map((logo) => ({
      ...logo,
      id: `${league}-${logo.id}`,
      name: `${logo.name} · ${league === 'superleague' ? 'Суперлига' : 'Высшая лига А'}`,
    })),
  );

  const update: MatchStatsChange = (key, value) => {
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
    const errors = { ...validateMatchStats(data), ...uploadErrors };
    if (!data.showPlayer) delete errors.photo;
    if (Object.keys(errors).length) {
      return 'invalid';
    }
    setSaving(true);
    setError('');
    try {
      await exportMatchStats(data);
      return 'saved';
    } catch {
      setError('Не удалось сохранить картинку. Попробуйте ещё раз.');
      return 'error';
    } finally {
      setSaving(false);
    }
  }

  function selectLogo(target: 'homeLogo' | 'awayLogo', src: string | null) {
    setData((previous) => {
      const league =
        target === 'homeLogo'
          ? ((Object.keys(teamLogosByLeague) as LeagueId[]).find((id) =>
              teamLogosByLeague[id].some((logo) => logo.src === src),
            ) ?? previous.league)
          : previous.league;
      return selectTeamLogo({ ...previous, league }, target, src, teamLogosByLeague[league]);
    });
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
    selectLogo,
    upload,
    save,
  };
}
