import { ThemeProvider } from '@emotion/react';
import { HomePage } from '../pages/home-page/HomePage';
import { GlobalStyles } from './GlobalStyles';
import { theme } from './theme';
import { useEffect, useState } from 'react';
import { BirthdayEditor } from '../pages/birthday/BirthdayEditor';
import { MatchDayEditor } from '../pages/match-day/MatchDayEditor';

import { MatchScoreEditor } from '../pages/match-score/MatchScoreEditor';

import { MatchStatsEditor } from '../pages/match-stats/MatchStatsEditor';
import { PngExportDialog } from '../shared/ui/poster/PngExportDialog';

export function App() {
  const [route, setRoute] = useState(window.location.hash);
  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {route === '#/match-day' ? (
        <MatchDayEditor />
      ) : route === '#/match-stats' ? (
        <MatchStatsEditor />
      ) : route === '#/match-score' ? (
        <MatchScoreEditor />
      ) : route === '#/birthday' ? (
        <BirthdayEditor />
      ) : (
        <HomePage />
      )}
      <PngExportDialog />
    </ThemeProvider>
  );
}
