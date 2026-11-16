import styled from '@emotion/styled';

export const PreviewPanel = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 6px 0;
  background: ${({ theme }) => theme.colors.background};
`;

export const PreviewArea = styled.div`
  position: relative;
  width: min(100%, 44svh);
  margin: 0 auto;
  aspect-ratio: 1;
  background: #f5f2e8;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: auto;
`;

export const PreviewStatus = styled.span`
  position: absolute;
  right: 6px;
  bottom: 6px;
  padding: 2px 6px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
  font-size: 10px;
`;
