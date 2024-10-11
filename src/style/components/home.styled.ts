import styled, { css } from "styled-components"

export const AdjustRealTimeFlex = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: space-evenly;
align-items: center;
padding: .5rem;
margin: .5rem 0;

& > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;
}

& > div > div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  height: 65px;
  max-width: 300px;
  max-height: 70px;
  border-radius: var(--border-radius-big);
  padding: .7rem 1rem;
  border: 2px solid ${props => props.$primary ? 'var(--danger-color)' : 'var(--main-color)'};
  overflow: hidden;

  & > span {
    font-weight: bold;
    font-size: 16px;
  }

  & > span > span {
    color: ${props => props.$primary ? 'var(--danger-color)' : 'var(--main-color)'};
    font-weight: bold;
    font-size: 28px;
  }
}

& > svg:nth-child(3) {
    display: none;
  }

@media (max-width: 430px) {
  flex-direction: column;
  gap: 1rem;

  & > svg:nth-child(2) {
    display: none;
  }
  & > svg:nth-child(3) {
    display: block;
  }
}
`

export const OpenSettingBuzzer = styled.button<{ $primary?: boolean }>`
display: flex;
align-items: center;
width: max-content;
height: 50px;
gap: .5rem;
padding: 1rem;
background-color: var(--main-color);
border-radius: var(--border-radius-big);
border: 2px solid transparent;

& > svg, span {
  color: var(--white);
  font-weight: bold;
}

&:hover {
  background-color: var(--second-color);
  transition: .3s;

  & > svg, span {
  color: var(--white);
  transition: .3s;
  }
}

@media (max-width: 430px) {
  padding: 1.3rem;
  justify-content: center;
  width: 100%;
}
`

export const ModalMuteHead = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: .3rem;
cursor: pointer;

&:hover {
  color: var(--grey);
  transition: .3s;

  & > button {
  & svg {
    color: var(--grey);
    transition: .3s;
  }
}
}


`

export const TagCurrentHos = styled.span`
  padding: 7px .8rem;
  background-color: var(--main-color-opacity2);
  border-radius: var(--border-radius-big);
`

export const NotiActionFlex = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${props => props.$primary && css`
  flex-direction: unset;
  justify-content: center;
  align-items: center;
  padding: 1rem;
    `}

  & > div:nth-child(1) {
    & > button:nth-child(2) {
      background-color: var(--main-color);
      padding: .5rem .7rem;
      color: var(--white);
      border: unset;
      border-radius: var(--border-radius-small);

      &:hover {
        background-color: var(--second-color);
        transition: .3s;
      }
    }
  }

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > div:nth-child(1) {
      display: flex;
      flex-direction: column;
      gap: .3rem;

      & > span:nth-child(2) {
        font-size: 14px;
        color: var(--main-color);
      }
    }

    & > div:nth-child(2) {
      display: flex;
      align-items: center;
      gap: .5rem;

      &>button:nth-child(2) {
        background-color: var(--main-color);
        padding: .3rem .7rem;
        color: var(--white);
        border: unset;
        border-radius: var(--border-radius-small);

        &:hover {
          background-color: var(--second-color);
          transition: .3s;
        }
      }

      &>button:nth-child(3) {
        background-color: var(--danger-color);
        padding: .3rem .7rem;
        color: var(--white);
        border: unset;
        border-radius: var(--border-radius-small);

        &:hover {
          background-color: var(--danger-color-hover);
          transition: .3s;
        }
      }
    }
  }
`

export const SpanDivider = styled.span<{ $width: string }>`
  text-align: center;
  width: ${props => props.$width};
  padding: 0 1rem;
  color: var(--grey);
`

export const ScheduleFlec = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: 1rem;

&>span {
  font-size: 14px;
  color: var(--grey-50);
}
`

export const ScheduleItem = styled.div`
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 1rem;
width: 100%;

&>div {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: .5rem;
  width: 100%;
}

@media (max-width: 430px) {
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}
`

export const ToggleButtonAllDays = styled.button<{ $primary?: boolean }>`
  position: relative;
  width: 60px;
  height: 35px;
  background-color: ${(props) => (props.$primary ? 'var(--main-color)' : '#ddd')};
  border: 1px solid ${(props) => (props.$primary ? 'var(--main-color)' : '#ccc')};
  border-radius: 20px;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  overflow: hidden;

  .icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    font-size: 14px;
    background-color: ${(props) => (props.$primary ? 'var(--white-grey-1)' : 'var(--white-grey-1)')};
    transition: transform 0.3s ease;
    transform: ${(propss) =>
    propss.$primary ? 'translateX(28px)' : 'translateX(2.5px)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => (props.$primary ? 'var(--main-last-color)' : 'var(--main-last-color)')};
    transition: .3s;
  }

  &:hover {
  border-color: var(--main-color);
  transition: .3s;
}
`

export const ScheduleItemFlex = styled.div`
display: grid;
grid-template-columns: repeat(2, 1fr);
align-content: center;

&>div {
  display: flex;
  gap: .5rem;

  @media (max-width: 430px) {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 430px) {
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}
`

export const MuteFlex = styled.div`
display: flex;
justify-content: space-around;

@media (max-width: 430px) {
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
`

export const HomeCardItem = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
gap: 0.5rem;
background-color: ${props => props.$primary ? 'var(--main-color)' : props.theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--white)'};
color: ${props => props.$primary ? 'var(--white)' : 'var(--balck)'};
padding: 0.8rem;
width: 145px;
height: max-content;
max-width: 150px;
max-height: 130px;
border-radius: var(--border-radius-small);
box-shadow: rgba(50, 50, 50, 0.1) 0px 12px 28px;
transition: 0.3s;
cursor: pointer;
overflow: hidden;

&>span:nth-child(1) {
  font-size: 14px;
  max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

&>div>span:nth-child(1) {
  font-size: 12px;
}

&:hover {
  transform: scale(1.05);
  transition: 0.3s;
}

&>div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0px 0.5rem;
}

@media (max-width: 1185px) {
  width: 130px;
  max-height: 120px;

  &>span {
    font-size: 12px !important;
  }

  &>h3 {
    font-size: 20px;
  }
}
`

export const CountStyle = styled.h3<{ $primary?: boolean }>`
  color: ${props => props.$primary && 'var(--danger-color)'};
  text-align: center;
  font-weight: bold;
`

export const ScheduleContainer = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
margin-right: .5rem;

&>div {
  display: flex;
  align-items: center;
  gap: .5rem;
  cursor: pointer;

  &:hover {
    color: var(--grey-50);
    transition: .3s;
  }
}
`

export const FloatingTop = styled.div<{ $primary?: boolean }>`
  display: ${props => (props.$primary ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: var(--main-color);
  color: var(--white);
  border-radius: var(--border-radius-small);
  box-shadow: 5px 8px 15px -5px rgba(0, 0, 0, .3);
  cursor: pointer;

  &:hover {
    background-color: var(--second-color);
    transition: .3s;
  }

  @media (max-width: 430px) {
    display: none;
}
`

export const OnErrorFlex = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: .5rem;

  &>span {
    font-size: 12px;
    text-align: center;
    color: var(--danger-color);
  }
`