import styled from '@emotion/styled';

export const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
`;

export const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  width: 44px;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

export const ToggleThumb = styled.span<{ $dark: boolean }>`
  position: relative;
  width: 44px;
  height: 26px;
  border: 1px solid ${({ theme }) => theme.colors.green};
  border-radius: 20px;
  background: ${({ theme, $dark }) => ($dark ? theme.colors.green : theme.colors.white)};
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $dark }) => ($dark ? '23px' : '3px')};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme, $dark }) => ($dark ? theme.colors.white : theme.colors.green)};
  }
`;
