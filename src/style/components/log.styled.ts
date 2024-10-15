import styled from "styled-components"

export const LogContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &>h3 {
    margin: unset;
  }

  @media (max-width: 430px) {
    flex-direction: column;
    align-items: unset;
}
`

export const LogForm = styled.form`
display: flex;
gap: .5rem;
margin: 1rem 1.5rem 1rem 0;

@media (max-width: 430px) {
  margin: 1rem 0;
}
`

export const PreLine = styled.pre<{ $primary?: boolean }>`
  height: calc(100dvh - 250px);
  max-height: calc(100dvh - 250px);
  max-width: ${props => props.$primary ? 'calc(100vw - 420px)' : 'calc(100vw - 550px)'};
  overflow-y: scroll;
  padding: .5rem .3rem;
  border-radius: var(--border-radius-small);
  border: 1px solid var(--grey);
  transition: max-width .3s;

  @media (max-width: 430px) {
    max-height: calc(100dvh - 200px);
    max-width: unset;
}
`