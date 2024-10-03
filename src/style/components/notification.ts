import styled, { css } from "styled-components"

export const NotiHead = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: 1rem .5rem;
  background-color: ${(propss) => (propss.theme.mode === 'dark' ? 'var(--main-last-rgba)' : 'var(--main-white-rgba)')};
  backdrop-filter: ${(propss) => (propss.theme.mode === 'dark' ? 'blur(35px)' : 'blur(20px)')};
  -webkit-backdrop-filter: ${(propss) => (propss.theme.mode === 'dark' ? 'blur(35px)' : 'blur(20px)')};
  position: sticky;
  top: 0;
`

export const NotiHeadBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 35px;
  border-radius: var(--border-radius-big);
  background-color: unset;
  border: 2px solid ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--grey-75)'};
  color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--black)'};
  font-weight: bold;
  padding: 0.5rem;

  &:hover {
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
    color: var(--white);
    transition: .3s;
  }

  ${props => props.$primary &&
    css`
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
    color: var(--white);
  `}
`

export const NotificationSoundFlex = styled.div<{ $primary?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  opacity: 1;
  transition: .3s;

  &>span {
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  ${props => props.$primary && css`
  opacity: .5;
  transition: .3s;

  &>button:hover {
    cursor: unset;
  }
  `}
`

export const NotificationSoundButton = styled.button<{ $primary?: boolean }>`
  position: relative;
  width: 60px;
  height: 35px;
  background-color: ${(propss) => (propss.$primary ? 'var(--main-color)' : '#ddd')};
  border: 1px solid ${(propss) => (propss.$primary ? 'var(--main-color)' : '#ccc')};
  border-radius: 20px;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  overflow: hidden;

  .icon {
    font-size: 14px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${(propss) => (propss.$primary ? 'var(--white-grey-1)' : 'var(--white-grey-1)')};
    transition: transform 0.3s ease;
    transform: ${(propss) =>
    propss.$primary ? 'translateX(25.5px)' : 'translateX(2.7px)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(propss) => (propss.$primary ? 'var(--main-last-color)' : 'var(--main-last-color)')};
    transition: .3s;
  }

  &:hover {
  border-color: var(--main-color);
  transition: .3s;
}
`

export const LiNoti = styled.li<{ $primary?: boolean }>`
  list-style-type: none;
`