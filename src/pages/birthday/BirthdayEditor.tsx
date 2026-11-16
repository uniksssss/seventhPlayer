import { useRef } from 'react';
import { useBirthdayEditor } from '../../features/birthday/model/useBirthdayEditor';
import { BirthdayForm } from '../../features/birthday/ui/BirthdayForm';
import { BirthdayPreview } from '../../features/birthday/ui/BirthdayPreview';
import { focusFirstInvalidField } from '../../shared/lib/form';
import { Page, Header, Back, Title } from '../../shared/ui/poster/EditorLayout.styles';

export function BirthdayEditor() {
  const editor = useBirthdayEditor();
  const pageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  async function handleSave() {
    if ((await editor.save()) === 'invalid') {
      requestAnimationFrame(() => focusFirstInvalidField(pageRef.current, panelRef.current));
    }
  }

  return (
    <Page ref={pageRef}>
      <Header>
        <Back href="#/" aria-label="Назад к выбору поста">
          ←
        </Back>
        <Title>С днём рождения</Title>
      </Header>
      <BirthdayPreview
        data={editor.data}
        panelRef={panelRef}
        photoError={editor.errors.photo}
        uploading={editor.uploading}
        update={editor.update}
        onUpload={editor.uploadPhoto}
      />
      <BirthdayForm
        data={editor.data}
        errors={editor.errors}
        error={editor.error}
        saving={editor.saving}
        update={editor.update}
        onSave={() => void handleSave()}
      />
    </Page>
  );
}
