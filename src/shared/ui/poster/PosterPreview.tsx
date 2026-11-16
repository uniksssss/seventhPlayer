import { useEffect, useRef, useState } from 'react';
import { ErrorText } from '../form/Form.styles';
import { PreviewArea, Canvas, PreviewStatus } from './PosterPreview.styles';

interface PosterPreviewProps<T> {
  data: T;
  render: (data: T) => Promise<HTMLCanvasElement>;
  size: number;
  description: string;
}

export function PosterPreview<T>({ data, render, size, description }: PosterPreviewProps<T>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setRendering(true);
    setError('');
    render(data)
      .then((canvas) => {
        try {
          if (cancelled) return;
          const context = canvasRef.current?.getContext('2d');
          if (!context) throw new Error('Не удалось показать превью.');
          context.canvas.width = canvas.width;
          context.canvas.height = canvas.height;
          context.drawImage(canvas, 0, 0);
        } finally {
          canvas.width = canvas.height = 0;
        }
      })
      .catch(() => {
        if (!cancelled)
          setError('Не удалось обновить превью. Проверьте изображения и обновите страницу.');
      })
      .finally(() => {
        if (!cancelled) setRendering(false);
      });
    return () => {
      cancelled = true;
    };
  }, [data, render]);

  return (
    <>
      <PreviewArea aria-busy={rendering}>
        <Canvas ref={canvasRef} width={size} height={size} role="img" aria-label={description} />
        {rendering && <PreviewStatus role="status">Обновляем…</PreviewStatus>}
      </PreviewArea>
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </>
  );
}
