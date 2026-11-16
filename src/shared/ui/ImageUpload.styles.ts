import styled from '@emotion/styled';

export const UploadButton = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white};
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
  &:has(input[aria-invalid='true']) {
    border-color: ${({ theme }) => theme.colors.red};
  }
  &:focus-within {
    outline: 3px solid ${({ theme }) => theme.colors.green};
    outline-offset: 2px;
  }
`;

export const HiddenFile = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
`;
