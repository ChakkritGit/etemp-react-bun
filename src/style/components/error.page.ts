import styled, { css } from "styled-components"
import bg from '../../assets/images/bg-not-found.jpeg'

export const ErrorPageStyled = styled.div`
position: relative;

  &>div:nth-child(1) {
    width: 100%;
    height: 100dvh;
    background-image: ${`url(${bg})`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.5;
    position: absolute;
    left: 0;
    top: 0;
  }

  &>div:nth-child(2) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100dvh;
    gap: 2rem;

    &>span {
      font-size: 104px;

      @media (max-width: 430px) {
        font-size: 72px;
      }
    }

    &> div {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: .5rem;

      &>span {
        font-size: 42px;
      }

      &>p {
        font-size: 24px;

      &>button {
        height: 40px;
        width: max-content;
        padding: .5rem .8rem;
        background-color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--black)'};
        border-radius: var(--border-radius-small);
        font-size: 18px;
        color: ${props => props.theme.mode === 'dark' ? 'var(--black)' : 'var(--white)'};
        border: none;
        cursor: pointer;
      }

      &>button:hover {
        background-color: var(--hover-dark-color);
        color: var(--white);
        transition: .3s;
      }
      }
    }

    ${props => props.theme.mode === 'dark' && css`
    color: var(--white);
  `}
  }
`

export const SomethingWrongPageStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: calc(100dvh - 150px);

  &>p>i {
    text-underline-offset: 8px;
    cursor: pointer;
  }

  &>p>i:hover {
    text-decoration: underline;
    transition: .3s;
  }
`