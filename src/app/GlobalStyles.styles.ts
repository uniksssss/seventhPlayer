import { css } from '@emotion/react';
import type { AppTheme } from './theme';

export const globalStyles = (theme: AppTheme) => css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  html {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    overscroll-behavior-x: none;
  }
  body {
    margin: 0;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    font-family: ${theme.fonts.body};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    overflow-wrap: break-word;
  }
  #root {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    overflow-x: clip;
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
