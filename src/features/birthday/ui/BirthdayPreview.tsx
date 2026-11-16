import { PhotoControls } from '../../../shared/ui/poster/PhotoControls';
import type { Ref } from 'react';
import type { BirthdayData, BirthdayChange } from '../model/birthday';
import { renderBirthday, BIRTHDAY_POSTER_SIZE } from '../services/birthdayService';
import { PosterPreview } from '../../../shared/ui/poster/PosterPreview';
import { PreviewPanel } from '../../../shared/ui/poster/PosterPreview.styles';

interface BirthdayPreviewProps {
  data: BirthdayData;
  photoError?: string;
  uploading: boolean;
  update: BirthdayChange;
  onUpload: (file: File | undefined) => Promise<void>;
  panelRef: Ref<HTMLDivElement>;
}

export function BirthdayPreview({
  data,
  panelRef,
  photoError,
  uploading,
  update,
  onUpload,
}: BirthdayPreviewProps) {
  return (
    <PreviewPanel ref={panelRef}>
      <PosterPreview
        data={data}
        render={renderBirthday}
        size={BIRTHDAY_POSTER_SIZE}
        description={`С днём рождения! ${data.firstName} ${data.lastName}, номер ${data.playerNumber}`}
      />
      <PhotoControls
        photo={data.photo}
        photoX={data.photoX}
        photoY={data.photoY}
        error={photoError}
        uploading={uploading}
        onUpload={onUpload}
        onPositionChange={(axis, value) => update(axis === 'x' ? 'photoX' : 'photoY', value)}
      />
    </PreviewPanel>
  );
}
