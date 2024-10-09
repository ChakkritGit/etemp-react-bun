import styled, { css } from "styled-components"

export const PrivacyContainer = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--black)'};
  padding: 1rem;
  max-width: 720px;
  margin: 3rem auto;

  &>ul {
    margin-top: .5rem;
  }

  &>ul>li {
    margin-bottom: .5rem;
  }
`

export const BR = styled.div`
  margin: .725rem 0;
`

export const HeadTitle = styled.span`
  font-size: 1.125rem;
  font-weight: bold;
`

export const NavigateTop = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  ${props => props.$primary && css`
    &>div:nth-child(1) {
      width: 84px;
    }
  `}

  &>h4 {
    margin-bottom: unset;
  }

  &>div:nth-child(3) {
    width: 84px;
  }
`

export const BackPre = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  width: max-content;
  height: 35px;
  padding: 0 .5rem;
  cursor: pointer;

  &:hover {
    opacity: .5;
    transition: .3s;
  }
`