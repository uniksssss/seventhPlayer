import { PhotoControls } from '../../../shared/ui/poster/PhotoControls';
import type { Ref } from 'react';
import type { MatchScoreData, MatchScoreChange, MatchScoreUpload } from '../model/matchScore';
import { POSTER_SIZE, renderMatchScore } from '../services/matchScoreService';
import { PreviewPanel } from '../../../shared/ui/poster/PosterPreview.styles';
import { PosterPreview } from '../../../shared/ui/poster/PosterPreview';

interface MatchScorePreviewProps {
  data: MatchScoreData;
  photoError?: string;
  uploading: boolean;
  panelRef: Ref<HTMLDivElement>;
  update: MatchScoreChange;
  upload: MatchScoreUpload;
}

export function MatchScorePreview({
  data,
  photoError,
  uploading,
  panelRef,
  update,
  upload,
}: MatchScorePreviewProps) {
  return (
    <>
      <PreviewPanel ref={panelRef}>
        <PosterPreview
          data={data}
          render={renderMatchScore}
          size={POSTER_SIZE}
          description={`Итог матча, ${data.round} тур, ${data.homeScore}:${data.awayScore}, партии: ${data.sets.map((set) => `${set.home}:${set.away}`).join(', ')}`}
        />
        <PhotoControls
          photo={data.photo}
          photoX={data.photoX}
          photoY={data.photoY}
          error={photoError}
          uploading={uploading}
          onUpload={(file) => upload(file, 'photo')}
          onPositionChange={(axis, value) => update(axis === 'x' ? 'photoX' : 'photoY', value)}
        />
      </PreviewPanel>
    </>
  );
}
