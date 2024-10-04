import styled from "styled-components"

export const OpenResetPasswordModalButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  gap: .5rem;
  padding: 1rem;
  background-color: var(--main-color);
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;

  &:hover {
    background-color: var(--second-color);
    transition: .3s;
  }

  &>span {
    color: var(--white);
    font-weight: bold;
  }

  &>svg {
    color: var(--white);
    font-weight: bold;
  }
`