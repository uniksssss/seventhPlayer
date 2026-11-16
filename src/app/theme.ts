export const theme = {
  colors: {
    green: '#16503B',
    greenLight: '#e8f0eb',
    white: '#ffffff',
    red: '#c63f42',
    background: '#F5F2E8',
    text: '#19382b',
    muted: '#64736b',
    border: '#dde4dd',
  },
  fonts: {
    body: "'Avenir Next', 'Segoe UI', sans-serif",
  },
  radius: {
    card: '24px',
    control: '14px',
  },
} as const;

export type AppTheme = typeof theme;
