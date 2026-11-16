import styled from '@emotion/styled';

export const Page = styled.div`
  width: 100%;
  min-width: 0;
  max-width: 480px;
  margin: 0 auto;
  padding: max(8px, env(safe-area-inset-top)) 12px max(16px, env(safe-area-inset-bottom));
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const Back = styled.a`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: inherit;
  text-decoration: none;
  font-size: 24px;
`;

export const Title = styled.h1`
  font-size: 20px;
`;
