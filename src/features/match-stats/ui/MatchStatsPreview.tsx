import type { Ref } from 'react';
import type { MatchStatsData } from '../model/matchStats';
import { POSTER_SIZE, renderMatchStats } from '../services/matchStatsService';
import { PreviewPanel } from '../../../shared/ui/poster/PosterPreview.styles';
import { PosterPreview } from '../../../shared/ui/poster/PosterPreview';

interface MatchStatsPreviewProps {
  data: MatchStatsData;
  panelRef: Ref<HTMLDivElement>;
}

export function MatchStatsPreview({ data, panelRef }: MatchStatsPreviewProps) {
  return (
    <>
      <PreviewPanel ref={panelRef}>
        <PosterPreview
          data={data}
          render={renderMatchStats}
          size={POSTER_SIZE}
          description={`Статистика игры, ${data.homeScore}:${data.awayScore}${data.showPlayer ? `, лучший игрок: ${data.firstName} ${data.lastName}, ${data.playerPoints} очков` : ''}`}
        />
      </PreviewPanel>
    </>
  );
}
