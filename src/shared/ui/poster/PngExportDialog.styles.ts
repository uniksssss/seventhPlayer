import styled from '@emotion/styled';

export const ExportDialog = styled.dialog`
  width: min(420px, calc(100% - 24px));
  max-height: calc(100svh - 32px);
  padding: 18px;
  border: 0;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  overflow-y: auto;

  &::backdrop {
    background: rgb(0 0 0 / 45%);
  }
`;

export const ExportContent = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;

  h2 {
    font-size: 20px;
  }
`;

export const ExportImage = styled.img`
  width: min(100%, 36svh);
  aspect-ratio: 1;
  object-fit: contain;
  justify-self: center;
`;

export const DownloadLink = styled.a`
  display: grid;
  place-items: center;
  min-height: 46px;
  padding: 8px 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.green};
  color: white;
  font-weight: 600;
  text-decoration: none;
`;

export const TextButton = styled.button`
  min-height: 44px;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.green};
  text-decoration: underline;
  cursor: pointer;
`;
