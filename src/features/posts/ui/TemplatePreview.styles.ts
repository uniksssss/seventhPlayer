import styled from '@emotion/styled';

export const ReferenceImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
`;

export const ComingSoonPreview = styled.div`
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.greenLight};
  color: ${({ theme }) => theme.colors.green};
  font-size: clamp(16px, 4vw, 22px);
  font-weight: 800;
  text-align: center;
`;
