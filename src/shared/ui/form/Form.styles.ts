import styled from '@emotion/styled';

export const Fields = styled.fieldset`
  display: grid;
  gap: 14px;
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
`;

export const Group = styled.fieldset`
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
`;

export const Legend = styled.legend`
  padding: 0;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 700;
`;

export const Label = styled.label`
  display: grid;
  gap: 4px;
  min-width: 0;
  font-size: 12px;
`;

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.red};
  }
  &[type='range'] {
    min-height: 32px;
    margin: 0;
    padding: 0;
    accent-color: ${({ theme }) => theme.colors.green};
  }
`;

export const Hint = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

export const ErrorText = styled.p`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.red};
  font-size: 13px;
`;

export const PrimaryButton = styled.button`
  min-height: 46px;
  border: 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.green};
  color: white;
  font-weight: 600;
  cursor: pointer;
`;
