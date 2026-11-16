import type { ReactNode } from 'react';
import { getFieldErrorProps } from '../lib/form';
import { UploadButton, HiddenFile } from './ImageUpload.styles';

interface ImageUploadProps {
  children: ReactNode;
  label: string;
  field: string;
  error?: string;
  disabled?: boolean;
  onSelect: (file: File | undefined) => void | Promise<void>;
}

export function ImageUpload({
  children,
  label,
  field,
  error,
  disabled,
  onSelect,
}: ImageUploadProps) {
  return (
    <UploadButton>
      {children}
      <HiddenFile
        type="file"
        accept="image/png,image/jpeg,image/webp"
        aria-label={label}
        {...getFieldErrorProps(field, error)}
        disabled={disabled}
        onChange={(event) => {
          void onSelect(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
    </UploadButton>
  );
}
