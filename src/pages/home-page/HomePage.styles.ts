import styled from '@emotion/styled';

export const Page = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: max(20px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom));
`;

export const Header = styled.header`
  margin-bottom: 24px;
`;

export const HeaderLogo = styled.svg`
  display: block;
  width: 130px;
  max-width: 100%;
  height: auto;
  aspect-ratio: 1080 / 265;
`;

export const TemplatePicker = styled.fieldset`
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
`;

export const Title = styled.legend`
  padding: 0;
  margin-bottom: 16px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.5px;
`;

export const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

export const TemplateOption = styled.label`
  position: relative;
  min-width: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

export const TemplateLink = styled.a`
  min-width: 0;
  color: inherit;
  text-decoration: none;
  border-radius: 14px;
`;

export const Card = styled.div`
  height: 100%;
  padding: 5px;
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.radius.control};
  background: ${({ theme }) => theme.colors.white};
`;

export const SelectionIndicator = styled.span`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
`;

export const Radio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;

  &:checked + [data-template-card] {
    border-color: ${({ theme }) => theme.colors.green};
  }

  &:checked + [data-template-card] [data-selection-indicator] {
    border: 4px solid ${({ theme }) => theme.colors.green};
  }

  &:focus-visible + [data-template-card] {
    outline: 3px solid ${({ theme }) => theme.colors.green};
    outline-offset: 3px;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 48px;
  padding: 8px 4px 4px;
`;

export const TemplateName = styled.span`
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
`;
