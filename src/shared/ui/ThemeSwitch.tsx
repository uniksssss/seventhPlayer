import { ThemeToggle, ToggleButton, ToggleThumb } from './ThemeSwitch.styles';

interface ThemeSwitchProps {
  dark: boolean;
  onChange: (dark: boolean) => void;
}

export function ThemeSwitch({ dark, onChange }: ThemeSwitchProps) {
  return (
    <ThemeToggle>
      <span>Светлый</span>
      <ToggleButton
        type="button"
        role="switch"
        aria-label="Тёмный фон"
        aria-checked={dark}
        onClick={() => onChange(!dark)}
      >
        <ToggleThumb $dark={dark} />
      </ToggleButton>
      <span>Тёмный</span>
    </ThemeToggle>
  );
}
