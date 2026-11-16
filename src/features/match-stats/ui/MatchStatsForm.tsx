import type { MatchStatsData, MatchStatsChange, MatchStatsUpload } from '../model/matchStats';
import { statLabels, normalizeStatInput } from '../model/matchStats';
import type { StatId } from '../model/matchStats';
import type { TeamLogo } from '../../match-day/model/matchDay';
import type { MatchStatsErrors } from '../model/validateMatchStats';
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
import { PhotoControls } from '../../../shared/ui/poster/PhotoControls';
import { Form, Row, TeamField, LogoRow } from '../../match-day/ui/MatchDayForm.styles';

interface MatchStatsFormProps {
  data: MatchStatsData;
  errors: MatchStatsErrors;
  logos: readonly TeamLogo[];
  uploading: boolean;
  saving: boolean;
  error: string;
  update: MatchStatsChange;
  onLogoSelect: (target: 'homeLogo' | 'awayLogo', src: string | null) => void;
  upload: MatchStatsUpload;
  onSave: () => void;
}

export function MatchStatsForm({
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
}: MatchStatsFormProps) {
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
          <Legend>Статистика</Legend>
          {(Object.entries(statLabels) as [StatId, string][]).map(([id, label]) => (
            <Group key={id}>
              <Legend>
                {label}
                {id === 'reception' || id === 'attack' ? ', %' : ''}
              </Legend>
              <Row>
                {(['home', 'away'] as const).map((side, index) => {
                  const field = `${id}-${side}` as const;
                  return (
                    <Label key={side}>
                      Команда {index + 1}
                      <Input
                        inputMode="decimal"
                        maxLength={6}
                        value={data.stats[id][side]}
                        onFocus={(event) => event.currentTarget.select()}
                        {...getFieldErrorProps(field, errors[field])}
                        onChange={(event) =>
                          update('stats', {
                            ...data.stats,
                            [id]: {
                              ...data.stats[id],
                              [side]: normalizeStatInput(event.target.value),
                            },
                          })
                        }
                      />
                      <FieldError field={field} message={errors[field]} />
                    </Label>
                  );
                })}
              </Row>
            </Group>
          ))}
        </Group>
        <Group>
          <Legend>Лучший игрок матча</Legend>
          <label>
            <input
              type="checkbox"
              checked={data.showPlayer}
              onChange={(event) => update('showPlayer', event.target.checked)}
            />{' '}
            Добавить лучшего игрока
          </label>
          {data.showPlayer && (
            <>
              <PhotoControls
                photo={data.photo}
                photoX={data.photoX}
                photoY={data.photoY}
                error={errors.photo}
                uploading={uploading}
                onUpload={(file) => upload(file, 'photo')}
                onPositionChange={(axis, value) =>
                  update(axis === 'x' ? 'photoX' : 'photoY', value)
                }
              />
              <Row>
                {(['firstName', 'lastName'] as const).map((field) => (
                  <Label key={field}>
                    {field === 'firstName' ? 'Имя' : 'Фамилия'}
                    <Input
                      value={data[field]}
                      maxLength={40}
                      {...getFieldErrorProps(field, errors[field])}
                      onChange={(event) => update(field, event.target.value)}
                    />
                    <FieldError field={field} message={errors[field]} />
                  </Label>
                ))}
              </Row>
              <Label>
                Очки
                <Input
                  inputMode="numeric"
                  maxLength={3}
                  value={data.playerPoints}
                  onFocus={(event) => event.currentTarget.select()}
                  {...getFieldErrorProps('playerPoints', errors.playerPoints)}
                  onChange={(event) =>
                    update(
                      'playerPoints',
                      event.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, ''),
                    )
                  }
                />
                <FieldError field="playerPoints" message={errors.playerPoints} />
              </Label>
            </>
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
