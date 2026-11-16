import { useRef } from 'react';
import { useMatchScoreEditor } from '../../features/match-score/model/useMatchScoreEditor';
import { MatchScoreForm } from '../../features/match-score/ui/MatchScoreForm';
import { MatchScorePreview } from '../../features/match-score/ui/MatchScorePreview';
import { focusFirstInvalidField } from '../../shared/lib/form';
import { Page, Header, Back, Title } from '../match-day/MatchDayEditor.styles';

export function MatchScoreEditor() {
  const editor = useMatchScoreEditor();
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
        <Title>Итог матча</Title>
      </Header>
      <MatchScorePreview
        data={editor.data}
        photoError={editor.fieldErrors.photo}
        uploading={editor.uploading}
        panelRef={previewPanelRef}
        update={editor.update}
        upload={editor.upload}
      />
      <MatchScoreForm
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
