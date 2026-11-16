import { Global, useTheme } from '@emotion/react';
import { globalStyles } from './GlobalStyles.styles';

export function GlobalStyles() {
  const theme = useTheme();
  return <Global styles={globalStyles(theme)} />;
}
