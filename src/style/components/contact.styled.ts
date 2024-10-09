import styled from "styled-components"

export const ContactContainer = styled.div`
  color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--black)'};
  padding: 1rem;
  max-width: 1480px;
  margin: 0 auto;

  &>h1 {
    text-align: center;
    margin: 1rem 0 0 0;
  }
`
export const ListGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 3rem;

  &>div:nth-child(1) {
    width: 700px;
    background-color: ${props => props.theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--white)'};
    padding: 1rem;
    border-radius: var(--border-radius-small);
    box-shadow: rgba(50, 50, 50, 0.1) 0px 12px 28px;
  }
`

export const SubmitButton = styled.button`
  margin-top: 1rem;
  width: 100%;
  padding: .5rem;
  border: unset;
  border-radius: var(--border-radius-small);
  background-color: var(--main-color);
  font-size: 18px;
  font-weight: bold;
  color: var(--white);

  &:hover {
    background-color: var(--second-color);
    transition: .3s;
  }
`

export const LabelContact = styled.label`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`

export const InputSupport = styled.input`
  padding: .5rem;
  font-size: 16px;
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'var(--border-dark-color)' : 'var(--grey-25)'};
  background-color: transparent;
  border-radius: var(--border-radius-small);
  color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--black)'};
  flex: 1;

  &:focus {
    outline: unset;
  }
`

export const PhoneGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  select {
    padding: .5rem;
    font-size: 16px;
    border: 1px solid ${props => props.theme.mode === 'dark' ? 'var(--border-dark-color)' : 'var(--grey-25)'};
    background-color: transparent;
    border-radius: var(--border-radius-small);
    color: var(--grey);
  }
`

export const TextAreContact = styled.textarea`
  width: 100%;
  padding: .5rem;
  font-size: 16px;
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'var(--border-dark-color)' : 'var(--grey-25)'};
  background-color: transparent;
  border-radius: var(--border-radius-small);
  color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--black)'};
  flex: 1;

  &:focus {
    outline: unset;
  }
`

export const AgreeSection = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 1rem 0 .5rem 0;

  &>span>a {
    text-decoration: unset;
    color: var(--main-color);
    font-weight: bold;

    &:hover {
      opacity: .5;
      transition: .3s;
    }
  }
`

export const CardListFlex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  &>a {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    width: 180px;
    height: 140px;
    background-color: ${props => props.theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--white)'};
    padding: 1rem;
    border-radius: var(--border-radius-small);
    box-shadow: rgba(50, 50, 50, 0.1) 0px 12px 28px;
    text-decoration: unset;

    &>span {
      color: var(--main-color);
    }

    &>svg {
      font-size: 42px;
      fill: var(--main-color);
    }
  }

  &>a:hover {
    opacity: .5;
    transition: .3s;
  }
`