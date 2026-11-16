// Готовые шаблоны идут в порядке добавления макетов, затем — будущие.
export const postTemplates = [
  { id: 'match-day', title: 'Матч-день', ready: true },
  { id: 'birthday', title: 'С днём рождения', ready: true },
  { id: 'match-score', title: 'Итог матча', ready: true },
  { id: 'match-stats', title: 'Статистика игры', ready: true },
  { id: 'thank-you', title: 'Спасибо за игру', ready: false },
  { id: 'holiday', title: 'С праздником', ready: false },
  { id: 'welcome', title: 'Добро пожаловать', ready: false },
  { id: 'custom', title: 'Свободная тема', ready: false },
] as const;

export type PostTemplateId = (typeof postTemplates)[number]['id'];
