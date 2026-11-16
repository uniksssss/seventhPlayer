import { useEffect, useRef, useState } from 'react';
import { PNG_EXPORT_EVENT } from '../../lib/images';
import { ErrorText, Hint } from '../form/Form.styles';
import {
  DownloadLink,
  ExportContent,
  ExportDialog,
  ExportImage,
  TextButton,
} from './PngExportDialog.styles';

function ExportSheet({ file, onClose }: { file: File; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [sharing, setSharing] = useState(false);
  const canShare =
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] });

  useEffect(() => {
    setUrl('');
    setError('');
    // Готовим data URL заранее: нажатие ссылки сразу запускает скачивание.
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setUrl(reader.result);
    };
    reader.onerror = () =>
      setError('Не удалось подготовить ссылку скачивания. Попробуйте ещё раз.');
    reader.readAsDataURL(file);
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      reader.onload = null;
      reader.onerror = null;
      if (reader.readyState === FileReader.LOADING) reader.abort();
    };
  }, [file]);

  async function share() {
    setError('');
    setSharing(true);
    try {
      await navigator.share({ files: [file] });
      onClose();
    } catch (reason) {
      if (!(reason instanceof Error && reason.name === 'AbortError')) {
        setError('Не удалось открыть меню сохранения. Попробуйте ещё раз.');
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <ExportDialog ref={dialogRef} aria-labelledby="png-export-title" onCancel={onClose}>
      <ExportContent>
        <h2 id="png-export-title">PNG готов</h2>
        {!url && !error && <Hint role="status">Подготавливаем скачивание…</Hint>}
        {url && <ExportImage src={url} alt="Готовая карточка для сохранения" />}
        {url && (
          <DownloadLink href={url} download={file.name} target="_blank" rel="noopener">
            Скачать PNG
          </DownloadLink>
        )}
        {canShare && (
          <>
            <TextButton type="button" disabled={sharing} onClick={() => void share()}>
              Сохранить / поделиться
            </TextButton>
            <Hint>
              Если браузер открывает PNG вместо скачивания, выберите «Сохранить в Файлы» через
              «Сохранить / поделиться».
            </Hint>
          </>
        )}
        {error && <ErrorText role="alert">{error}</ErrorText>}
        <TextButton type="button" onClick={onClose}>
          Вернуться к редактированию
        </TextButton>
      </ExportContent>
    </ExportDialog>
  );
}

export function PngExportDialog() {
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    const open = (event: Event) => setFile((event as CustomEvent<File>).detail);
    window.addEventListener(PNG_EXPORT_EVENT, open);
    return () => window.removeEventListener(PNG_EXPORT_EVENT, open);
  }, []);
  return file ? <ExportSheet file={file} onClose={() => setFile(null)} /> : null;
}
