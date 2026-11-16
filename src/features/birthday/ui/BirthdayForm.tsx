import type { BirthdayData, BirthdayErrors, BirthdayChange } from '../model/birthday';
import { getFieldErrorProps } from '../../../shared/lib/form';
import { FieldError } from '../../../shared/ui/form/FieldError';
import {
  Fields,
  Label,
  Input,
  ErrorText,
  PrimaryButton,
} from '../../../shared/ui/form/Form.styles';
import { Form } from './BirthdayForm.styles';

interface BirthdayFormProps {
  data: BirthdayData;
  errors: BirthdayErrors;
  error: string;
  saving: boolean;
  update: BirthdayChange;
  onSave: () => void;
}

export function BirthdayForm({ data, errors, error, saving, update, onSave }: BirthdayFormProps) {
  return (
    <Form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <Fields>
        <Label>
          Имя
          <Input
            autoComplete="given-name"
            maxLength={40}
            value={data.firstName}
            {...getFieldErrorProps('firstName', errors.firstName)}
            onChange={(event) => update('firstName', event.target.value)}
          />
          <FieldError field="firstName" message={errors.firstName} />
        </Label>
        <Label>
          Фамилия
          <Input
            autoComplete="family-name"
            maxLength={40}
            value={data.lastName}
            {...getFieldErrorProps('lastName', errors.lastName)}
            onChange={(event) => update('lastName', event.target.value)}
          />
          <FieldError field="lastName" message={errors.lastName} />
        </Label>
        <Label>
          Номер игрока
          <Input
            inputMode="numeric"
            maxLength={2}
            value={data.playerNumber}
            {...getFieldErrorProps('playerNumber', errors.playerNumber)}
            onChange={(event) =>
              update('playerNumber', event.target.value.replace(/\D/g, '').slice(0, 2))
            }
          />
          <FieldError field="playerNumber" message={errors.playerNumber} />
        </Label>
      </Fields>
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <PrimaryButton type="submit" aria-busy={saving}>
        {saving ? 'Сохраняем…' : 'Скачать PNG'}
      </PrimaryButton>
    </Form>
  );
}
