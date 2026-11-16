import { useRef } from 'react';
import { useMatchStatsEditor } from '../../features/match-stats/model/useMatchStatsEditor';
import { MatchStatsForm } from '../../features/match-stats/ui/MatchStatsForm';
import { MatchStatsPreview } from '../../features/match-stats/ui/MatchStatsPreview';
import { focusFirstInvalidField } from '../../shared/lib/form';
import { Page, Header, Back, Title } from '../match-day/MatchDayEditor.styles';

export function MatchStatsEditor() {
  const editor = useMatchStatsEditor();
  const pageRef = useRef<HTMLDivElement>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);

  async function handleSave() {
    if ((await editor.save()) === 'invalid') {
      requestAnimationFrame(() => focusFirstInvalidField(pageRef.current, previewPanelRef.current));
    }
  }

  return (
    <Page ref={pageRef}>
      <Header>
        <Back href="#/" aria-label="Назад к выбору поста">
          ←
        </Back>
        <Title>Статистика игры</Title>
      </Header>
      <MatchStatsPreview data={editor.data} panelRef={previewPanelRef} />
      <MatchStatsForm
        data={editor.data}
        errors={editor.fieldErrors}
        logos={editor.logos}
        uploading={editor.uploading}
        saving={editor.saving}
        error={editor.error}
        update={editor.update}
        onLogoSelect={editor.selectLogo}
        upload={editor.upload}
        onSave={() => void handleSave()}
      />
    </Page>
  );
}
