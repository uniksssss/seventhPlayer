import { css } from '@emotion/react';
import type { AppTheme } from './theme';

export const globalStyles = (theme: AppTheme) => css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  html {
    overflow-x: clip;
  }
  body {
    margin: 0;
    min-width: 320px;
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    font-family: ${theme.fonts.body};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    overflow-wrap: break-word;
  }
  button,
  input,
  textarea,
  select {
    font: inherit;
  }
  button,
  a,
  input,
  textarea,
  select {
    -webkit-tap-highlight-color: transparent;
  }
  :focus-visible {
    outline: 3px solid ${theme.colors.green};
    outline-offset: 4px;
  }
  img {
    display: block;
    max-width: 100%;
  }
  h1,
  h2,
  p {
    margin: 0;
  }
`;
