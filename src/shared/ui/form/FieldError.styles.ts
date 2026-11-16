import styled from '@emotion/styled';

export const FieldError = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.red};
  font-size: 12px;
  line-height: 1.35;
`;
