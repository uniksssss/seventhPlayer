import { FieldError as ErrorMessage } from './FieldError.styles';

interface FieldErrorProps {
  field: string;
  message?: string;
}

export function FieldError({ field, message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <ErrorMessage id={`${field}-error`} role="alert">
      {message}
    </ErrorMessage>
  );
}
