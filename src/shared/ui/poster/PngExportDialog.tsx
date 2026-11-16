import { useEffect, useRef, useState } from 'react';
import { downloadPngFile, PNG_EXPORT_EVENT } from '../../lib/images';
import { ErrorText, Hint, PrimaryButton } from '../form/Form.styles';
import { ExportContent, ExportDialog, ExportImage, TextButton } from './PngExportDialog.styles';

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
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      URL.revokeObjectURL(objectUrl);
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
        {url && <ExportImage src={url} alt="Готовая карточка для сохранения" />}
        {canShare ? (
          <>
            <Hint>В меню телефона выберите «Сохранить изображение» или «Сохранить в Файлы».</Hint>
            <PrimaryButton type="button" disabled={sharing} onClick={() => void share()}>
              Сохранить PNG
            </PrimaryButton>
          </>
        ) : (
          <>
            <TextButton type="button" onClick={() => downloadPngFile(file)}>
              Открыть PNG в новой вкладке
            </TextButton>
            <Hint>
              Сохраните изображение через меню браузера или долгим нажатием на него. Редактор
              останется в исходной вкладке.
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
