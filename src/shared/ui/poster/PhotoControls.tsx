import type { ReactNode } from 'react';
import { ImageUpload } from '../ImageUpload';
import { FieldError } from '../form/FieldError';
import { Input, Label } from '../form/Form.styles';
import { PhotoToolbar, CropRow } from './PhotoControls.styles';

interface PhotoControlsProps {
  photo: string | null;
  photoX: number;
  photoY: number;
  error?: string;
  uploading: boolean;
  children?: ReactNode;
  onUpload: (file: File | undefined) => Promise<void>;
  onPositionChange: (axis: 'x' | 'y', value: number) => void;
}

export function PhotoControls({
  photo,
  photoX,
  photoY,
  error,
  uploading,
  children,
  onUpload,
  onPositionChange,
}: PhotoControlsProps) {
  return (
    <>
      <PhotoToolbar>
        {children}
        <ImageUpload
          label="Загрузить фотографию"
          field="photo"
          error={error}
          disabled={uploading}
          onSelect={onUpload}
        >
          {uploading ? 'Загружаем…' : photo ? 'Заменить фото' : '+ Фото'}
        </ImageUpload>
      </PhotoToolbar>
      <FieldError field="photo" message={error} />
      {photo && (
        <CropRow>
          <Label>
            ↔ Горизонталь
            <Input
              type="range"
              min={0}
              max={100}
              value={photoX}
              onChange={(event) => onPositionChange('x', Number(event.target.value))}
            />
          </Label>
          <Label>
            ↕ Вертикаль
            <Input
              type="range"
              min={0}
              max={100}
              value={photoY}
              onChange={(event) => onPositionChange('y', Number(event.target.value))}
            />
          </Label>
        </CropRow>
      )}
    </>
  );
}
