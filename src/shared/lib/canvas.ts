/** Область исходника для заполнения рамки без изменения пропорций. */
export function getCoverCrop(
  imageWidth: number,
  imageHeight: number,
  frameWidth: number,
  frameHeight: number,
  positionX = 50,
  positionY = 50,
) {
  const scale = Math.max(frameWidth / imageWidth, frameHeight / imageHeight);
  const width = frameWidth / scale;
  const height = frameHeight / scale;
  return {
    x: ((imageWidth - width) * positionX) / 100,
    y: ((imageHeight - height) * positionY) / 100,
    width,
    height,
  };
}
