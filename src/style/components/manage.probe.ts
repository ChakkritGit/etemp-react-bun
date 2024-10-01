import styled, { css } from "styled-components"

export const ManageProbeContainer = styled.div<{ $primary?: boolean }>`
${props => props.theme.mode === 'dark' &&
    css`
    .hiTDLB-st>div>div>div>div,
    .hiTDLB-st>div>div>div {
      color: var(--white-grey-1);
      background-color: var(--main-seccond-color);
      border-bottom-color: var(--border-dark-color);
    }

    div>nav {
      background-color: var(--main-seccond-color);
      color: var(--white-grey-1);
      border-top-color: var(--border-dark-color);

      div>button {
        color: var(--white-grey-1) !important;
        fill: var(--white-grey-1) !important;
      }

      &>div>button:disabled {
    cursor: unset;
    color: rgba(255, 255, 255, .30) !important;
    fill: rgba(255, 255, 255, .30) !important;
  }
    }
`}
`

export const ManageProbeHeader = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: space-between;

&>div:nth-child(2) {
  display: flex;
  align-items: center;
  gap: .5rem;
  z-index: 99;

  &>div {
    display: flex;
    align-items: center;
    gap: .5rem;

  @media (max-width: 430px) {
  flex-direction: column;
  align-items: end;
}
  }

  @media (max-width: 430px) {
  flex-direction: column-reverse;
  align-items: end;
}
}

& h3 {
  margin-bottom: unset;
}
`

export const ManageProbeBody = styled.div<{ $primary?: boolean }>`
&>div>div>div>div,&>div>div>div {
  background-color: transparent;
}

&>div>div>div>div>div,
&>div>nav {
  background-color: var(--bg-grey);
}
${props => props.theme.mode === 'dark' &&
    css`
    &>div>div>div>div:nth-child(2)>div {
    border-bottom: 1px solid rgba(255, 255, 255, .1);
  }

&>div>div>div>div>div,
&>div>nav {
  background-color: var(--main-seccond-color);
  color: var(--white-grey-1);
  border-bottom: 1px solid rgba(255, 255, 255, .1);

  &>div>button {
    color: var(--white-grey-1) !important;
    fill: var(--white-grey-1) !important;
  }

  &>div>button:disabled {
    cursor: unset;
    color: rgba(255, 255, 255, .30) !important;
    fill: rgba(255, 255, 255, .30) !important;
  }
}
`}
`

export const Actiontableprobe = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: .5rem;
`

export const DelProbeButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--danger-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem;

&:hover {
  background-color: var(--danger-color-hover);
  transition: .3s;
}

& svg {
  stroke-width: 1px;
}
`

export const ManageProbeAdd = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  width: max-content;
  max-width: 165px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem .8rem;

  ${props => props.$primary && css`
  padding: unset;
    width: 36px;
  height: 36px;
    `}

&:hover {
  background-color: var(--second-color);
  transition: .3s;
}

& svg {
  stroke-width: 1px;
}
`

export const ProbeCH = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: var(--main-color-opacity1);
  border-radius: var(--border-radius-small);
  font-size: 18px;
`