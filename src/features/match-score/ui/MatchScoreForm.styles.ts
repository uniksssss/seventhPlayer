import styled from '@emotion/styled';

export const SetActionButton = styled.button`
  justify-self: start;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.green};
  font: inherit;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }
`;
