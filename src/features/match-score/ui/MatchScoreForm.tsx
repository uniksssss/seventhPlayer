import type { MatchScoreData, MatchScoreChange, MatchScoreUpload } from '../model/matchScore';
import { resizeSets } from '../model/matchScore';
import type { TeamLogo } from '../../match-day/model/matchDay';
import type { MatchScoreErrors } from '../model/validateMatchScore';
import { getFieldErrorProps } from '../../../shared/lib/form';
import { FieldError } from '../../../shared/ui/form/FieldError';
import {
  Fields,
  Group,
  Legend,
  Label,
  Input,
  Hint,
  ErrorText,
  PrimaryButton,
} from '../../../shared/ui/form/Form.styles';
import { ImageUpload } from '../../../shared/ui/ImageUpload';
import { SetActionButton } from './MatchScoreForm.styles';
import { Form, Row, TeamField, LogoRow } from '../../match-day/ui/MatchDayForm.styles';

interface MatchScoreFormProps {
  data: MatchScoreData;
  errors: MatchScoreErrors;
  logos: readonly TeamLogo[];
  uploading: boolean;
  saving: boolean;
  error: string;
  update: MatchScoreChange;
  onLogoSelect: (target: 'homeLogo' | 'awayLogo', src: string | null) => void;
  upload: MatchScoreUpload;
  onSave: () => void;
}

export function MatchScoreForm({
  data,
  errors,
  logos,
  uploading,
  saving,
  error,
  update,
  onLogoSelect,
  upload,
  onSave,
}: MatchScoreFormProps) {
  return (
    <Form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <Fields disabled={uploading}>
        <Group>
          <Label>
            Тур
            <Input
              {...getFieldErrorProps('round', errors.round)}
              inputMode="numeric"
              pattern="[0-9]{1,2}"
              maxLength={2}
              value={data.round}
              onChange={(event) =>
                update('round', event.target.value.replace(/\D/g, '').slice(0, 2))
              }
            />
            <FieldError field="round" message={errors.round} />
          </Label>
        </Group>

        <Group>
          <Legend>Команды</Legend>
          {(['homeLogo', 'awayLogo'] as const).map((target, index) => (
            <TeamField key={target}>
              <span>Команда {index + 1}</span>
              <LogoRow>
                <Input
                  as="select"
                  aria-label={`Логотип команды ${index + 1}`}
                  {...getFieldErrorProps(target, errors[target])}
                  value={data[target] ?? ''}
                  onChange={(event) => onLogoSelect(target, event.target.value || null)}
                >
                  <option value="">Выберите логотип</option>
                  {logos.map((logo) => (
                    <option key={logo.id} value={logo.src}>
                      {logo.name}
                    </option>
                  ))}
                </Input>
                <ImageUpload
                  label={`Загрузить логотип команды ${index + 1}`}
                  field={target}
                  error={errors[target]}
                  onSelect={(file) => upload(file, target)}
                >
                  + Свой
                </ImageUpload>
              </LogoRow>
              <FieldError field={target} message={errors[target]} />
            </TeamField>
          ))}
        </Group>
        <Group>
          <Legend>Итоговый счёт</Legend>
          <Row>
            {(['homeScore', 'awayScore'] as const).map((field, index) => (
              <Label key={field}>
                Команда {index + 1}
                <Input
                  as="select"
                  value={data[field]}
                  {...getFieldErrorProps(field, errors[field])}
                  onChange={(event) => update(field, event.target.value)}
                >
                  {[0, 1, 2, 3].map((score) => (
                    <option key={score} value={score}>
                      {score}
                    </option>
                  ))}
                </Input>
                <FieldError field={field} message={errors[field]} />
              </Label>
            ))}
          </Row>
        </Group>
        <Group>
          <Legend>Счёт по партиям</Legend>
          <FieldError field="sets" message={errors.sets} />
          {data.sets.map((set, index) => (
            <Group key={index}>
              <Legend>Партия {index + 1}</Legend>
              <Row>
                {(['home', 'away'] as const).map((side, team) => {
                  const field = `set-${index}-${side}` as const;
                  return (
                    <Label key={side}>
                      Команда {team + 1}
                      <Input
                        inputMode="numeric"
                        pattern="[0-9]{1,2}"
                        maxLength={2}
                        {...getFieldErrorProps(field, errors[field])}
                        value={set[side]}
                        onChange={(event) =>
                          update(
                            'sets',
                            data.sets.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    [side]: event.target.value.replace(/\D/g, '').slice(0, 2),
                                  }
                                : entry,
                            ),
                          )
                        }
                      />
                      <FieldError field={field} message={errors[field]} />
                    </Label>
                  );
                })}
              </Row>
              {index >= 3 && (
                <SetActionButton
                  type="button"
                  aria-label={`Убрать партию ${index + 1}`}
                  onClick={() =>
                    update(
                      'sets',
                      data.sets.filter((_, i) => i !== index),
                    )
                  }
                >
                  <span aria-hidden="true">− </span>Убрать партию
                </SetActionButton>
              )}
            </Group>
          ))}
          {data.sets.length < 5 && (
            <SetActionButton
              type="button"
              onClick={() => update('sets', resizeSets(data.sets, data.sets.length + 1))}
            >
              <span aria-hidden="true">+ </span>Добавить ещё партию
            </SetActionButton>
          )}
        </Group>
      </Fields>
      {uploading && <Hint role="status">Загружаем изображение…</Hint>}
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <PrimaryButton type="submit" aria-busy={saving}>
        {saving ? 'Сохраняем…' : 'Скачать PNG'}
      </PrimaryButton>
    </Form>
  );
}
