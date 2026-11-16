import { useRef } from 'react';
import { useMatchDayEditor } from '../../features/match-day/model/useMatchDayEditor';
import { MatchDayForm } from '../../features/match-day/ui/MatchDayForm';
import { MatchDayPreview } from '../../features/match-day/ui/MatchDayPreview';
import { focusFirstInvalidField } from '../../shared/lib/form';
import { Page, Header, Back, Title } from '../match-day/MatchDayEditor.styles';

export function MatchDayEditor() {
  const editor = useMatchDayEditor();
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
        <Title>День матча</Title>
      </Header>
      <MatchDayPreview
        data={editor.data}
        photoError={editor.fieldErrors.photo}
        uploading={editor.uploading}
        panelRef={previewPanelRef}
        update={editor.update}
        upload={editor.upload}
      />
      <MatchDayForm
        data={editor.data}
        errors={editor.fieldErrors}
        logos={editor.logos}
        uploading={editor.uploading}
        saving={editor.saving}
        error={editor.error}
        update={editor.update}
        onLeagueChange={editor.changeLeague}
        onLogoSelect={editor.selectLogo}
        upload={editor.upload}
        onSave={() => void handleSave()}
      />
    </Page>
  );
}
