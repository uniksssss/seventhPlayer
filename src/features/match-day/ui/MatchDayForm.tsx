import { leagues } from '../model/matchDay';
import type {
  LeagueId,
  MatchDayData,
  TeamLogo,
  MatchDayChange,
  MatchDayUpload,
} from '../model/matchDay';
import type { MatchDayErrors } from '../model/validateMatchDay';
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
import { Form, MatchRow, Row, TeamField, LogoRow } from './MatchDayForm.styles';

interface MatchDayFormProps {
  data: MatchDayData;
  errors: MatchDayErrors;
  logos: readonly TeamLogo[];
  uploading: boolean;
  saving: boolean;
  error: string;
  update: MatchDayChange;
  onLeagueChange: (league: LeagueId) => void;
  onLogoSelect: (target: 'homeLogo' | 'awayLogo', src: string | null) => void;
  upload: MatchDayUpload;
  onSave: () => void;
}

export function MatchDayForm({
  data,
  errors,
  logos,
  uploading,
  saving,
  error,
  update,
  onLeagueChange,
  onLogoSelect,
  upload,
  onSave,
}: MatchDayFormProps) {
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
          <MatchRow>
            <Label>
              Лига
              <Input
                as="select"
                aria-label="Лига"
                {...getFieldErrorProps('league', errors.league)}
                value={data.league}
                onChange={(event) => onLeagueChange(event.target.value as LeagueId)}
              >
                {Object.entries(leagues).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Input>
              <FieldError field="league" message={errors.league} />
            </Label>
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
          </MatchRow>
          <Row>
            <Label>
              Дата
              <Input
                {...getFieldErrorProps('date', errors.date)}
                type="date"
                value={data.date}
                onChange={(event) => update('date', event.target.value)}
              />
              <FieldError field="date" message={errors.date} />
            </Label>
            <Label>
              Время
              <Input
                {...getFieldErrorProps('time', errors.time)}
                type="time"
                value={data.time}
                onChange={(event) => update('time', event.target.value)}
              />
              <FieldError field="time" message={errors.time} />
            </Label>
          </Row>
          <Label>
            Место проведения
            <Input
              {...getFieldErrorProps('venue', errors.venue)}
              maxLength={80}
              value={data.venue}
              placeholder="Город или площадка"
              onChange={(event) => update('venue', event.target.value)}
            />
            <FieldError field="venue" message={errors.venue} />
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
      </Fields>
      {uploading && <Hint role="status">Загружаем изображение…</Hint>}
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <PrimaryButton type="submit" aria-busy={saving}>
        {saving ? 'Сохраняем…' : 'Скачать PNG'}
      </PrimaryButton>
    </Form>
  );
}
