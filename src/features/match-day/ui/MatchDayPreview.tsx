import { PhotoControls } from '../../../shared/ui/poster/PhotoControls';
import type { Ref } from 'react';
import { leagues } from '../model/matchDay';
import type { MatchDayData, MatchDayChange, MatchDayUpload } from '../model/matchDay';
import { POSTER_SIZE, renderMatchDay } from '../services/matchDayService';
import { ThemeSwitch } from '../../../shared/ui/ThemeSwitch';
import { PreviewPanel } from '../../../shared/ui/poster/PosterPreview.styles';
import { PosterPreview } from '../../../shared/ui/poster/PosterPreview';

interface MatchDayPreviewProps {
  data: MatchDayData;
  photoError?: string;
  uploading: boolean;
  panelRef: Ref<HTMLDivElement>;
  update: MatchDayChange;
  upload: MatchDayUpload;
}

export function MatchDayPreview({
  data,
  photoError,
  uploading,
  panelRef,
  update,
  upload,
}: MatchDayPreviewProps) {
  return (
    <>
      <PreviewPanel ref={panelRef}>
        <PosterPreview
          data={data}
          render={renderMatchDay}
          size={POSTER_SIZE}
          description={`День матча, ${data.round} тур, ${data.date}, ${data.time}, ${data.venue}, ${leagues[data.league]}`}
        />
        <PhotoControls
          photo={data.photo}
          photoX={data.photoX}
          photoY={data.photoY}
          error={photoError}
          uploading={uploading}
          onUpload={(file) => upload(file, 'photo')}
          onPositionChange={(axis, value) => update(axis === 'x' ? 'photoX' : 'photoY', value)}
        >
          <ThemeSwitch
            dark={data.theme === 'dark'}
            onChange={(dark) => update('theme', dark ? 'dark' : 'light')}
          />
        </PhotoControls>
      </PreviewPanel>
    </>
  );
}
