/** Связывает поле с сообщением об ошибке для экранных дикторов. */
export function getFieldErrorProps(field: string, error?: string) {
  return {
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${field}-error` : undefined,
  };
}

/** Прокручивает к ошибке с учётом закреплённого превью редактора. */
export function focusFirstInvalidField(root: HTMLElement | null, stickyPanel: HTMLElement | null) {
  const input = root?.querySelector<HTMLElement>('[aria-invalid="true"]');
  if (!input) return;
  input.focus({ preventScroll: true });
  const top = stickyPanel?.contains(input)
    ? 0
    : window.scrollY +
      input.getBoundingClientRect().top -
      (stickyPanel?.getBoundingClientRect().height ?? 0) -
      12;
  window.scrollTo({ top, behavior: 'smooth' });
}
