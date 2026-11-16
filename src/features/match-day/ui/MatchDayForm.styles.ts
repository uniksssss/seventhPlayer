import styled from '@emotion/styled';

export const Form = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
  gap: 10px;
  margin-top: 10px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 8px;
`;

export const MatchRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 70px;
  gap: 8px;
`;

export const LogoRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
`;

export const TeamField = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
  font-size: 12px;
`;
