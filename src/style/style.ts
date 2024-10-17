import styled, { css } from "styled-components"

export const ToggleButtonWrapper = styled.button`
  position: relative;
  width: 45px;
  height: 30px;
  background-color: ${(propss) => (propss.theme.mode === 'dark' ? 'var(--main-color)' : '#ddd')};
  border: 1px solid ${(propss) => (propss.theme.mode === 'dark' ? 'var(--main-color)' : '#ccc')};
  border-radius: 20px;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  overflow: hidden;

  .icon {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: ${(propss) => (propss.theme.mode === 'dark' ? 'var(--white-grey-1)' : 'var(--white-grey-1)')};
    transition: transform 0.3s ease;
    transform: ${(propss) =>
    propss.theme.mode === 'dark' ? 'translateX(16.5px)' : 'translateX(1.5px)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(propss) => (propss.theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--main-last-color)')};
    transition: .3s;
  }

  &:hover {
  border-color: var(--main-color);
  transition: .3s;
}
`

/* global btn */
export const GlobalButton = styled.button<{ $color?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5remrem;
  width: 80px;
  max-height: 50px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--danger-color);
  color: var(--white);
  font-weight: bold;
  padding: 0.5rem;

  &:hover {
    background-color: var(--danger-color-hover);
    transition: .3s;
  }
`

export const KeyboardShortcut = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  position: absolute;
  gap: .3rem;
  right: 10px;

  &>span {
    font-size: 14px;
    background-color: rgba(150, 150, 150, .2);
    border-radius: 5px;
    padding: 1.5px 8px;
  }
`

export const GlobalButtoncontainer = styled.div<{ $primary?: string }>`
display: flex;
align-items: center;
gap: .5rem;
`

// Root container sidebar and outlet
export const HamburgerExpand = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: right;
padding: .5rem;

${props => props.$primary === false && props.theme.mode === 'dark' &&
    css`
  background-color: var(--main-last-color);
  border-right: 1.5px solid var(--soft-grey);
`
  }

${props => props.theme.mode === 'dark' &&
    css`
button>svg {
  color: var(--white-grey-1);
}
border-color: var(--border-dark-color);
`}

${props => props.$primary ?
    css`
  display: unset;
  justify-content: unset;
  padding: unset;
`:
    css`
height: 53px;
`}

& button {
  background-color: unset;
  border: unset;
  color: black;

  & svg {
    font-size: 24px;
  }

  @media (min-width: 460px) {
    display: none;
  }
}

& button:hover {
  background-color: red !important;
}

& button:hover,
.btn:focus-visible {
  background-color: unset !important;
  color: black !important;
  border: unset;
  box-shadow: unset;
}
`

export const SideParent = styled.div<{ $primary?: boolean }>`
display: flex;
height: 100%;
padding: 0;
margin: 0;

${props => props.theme.mode === 'dark' &&
    css`
  background-color: var(--main-seccond-color);
  color: var(--white-grey-1);
`}

${props => props.$primary &&
    css`
  width: 100%;
  flex-direction: column;
`}

@media (max-width: 430px) {
  flex-direction: column;
}
`
export const SideChildSide = styled.div<{ $primary?: boolean }>`
height: 100dvh;
position: -webkit-sticky;
position: sticky;
top: 0;
z-index: 1020;
transition: .3s;

${props => props.$primary &&
    css`
  padding: 0;
`}

@media (max-width: 430px) {
  display: none;
}
`

export const SideChild = styled.div<{ $primary?: boolean }>`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1020;
`

export const SideChildOutlet = styled.div<{ $primary?: boolean }>`
padding: .5rem;
width: 100%;
max-width: 100%;
height: 100%;

@media (max-width: 430px) {
  margin-bottom: 80px;
}
`

// sidebar
export const Sidebar = styled.aside<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
flex-shrink: 0;
height: 100%;
width: 235px;
padding: 1rem;
border-right: 1.5px solid var(--soft-grey);
background-color: var(--white-grey-1);
transition: width ease .3s;

${props => props.$primary &&
    css`
  width: 90px;
`}

${props => props.theme.mode === 'dark' &&
    css`
  background-color: var(--main-last-color);
  border-color: var(--border-dark-color);

  .nav-link,
  ${HospitalName} {
    color: var(--white-grey-1) !important;
  }
`}

@media (max-width: 430px) {
  height: calc(100dvh - 53px);
}
`
export const SpanAside = styled.span<{ $primary?: boolean }>`
max-width: 130px;
width: 130px;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
transition: width ease .3s;

${props => props.$primary &&
    css`
  visibility: hidden;
  width: 0px;
`}
`

export const SidebarLogo = styled.img<{ $primary?: boolean }>`
  width: 100px;
  max-width: 100px;
  max-height: 100px;
  margin-bottom: .5rem;
  overflow: hidden;

  ${porps => porps.$primary && css`
    width: 80px;
    max-width: 80px;
    max-height: 80px;
  `}
`

export const HospitalName = styled.span<{ $primary?: boolean }>`
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: calc(1.275rem + .3vw);
  transition: .3s;

  ${props => props.$primary &&
    css`
    display: none;
  `}
`

export const ExpandSidebar = styled.button<{ $primary?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: unset;
  background-color: unset;
  border-radius: 0.5rem;
  width: 35px;
  height: 35px;
  z-index: 2000;

  &:hover {
  background-color: var(--soft-grey);
  transition: .3s;

  ${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);
`}
}

  & svg {
    font-size: 24px;
  }

  ${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
`}
`

export const ExpandContainer = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: right;
align-items: center;

@media (max-width: 430px) {
  display: none;
}
`

export const Ul = styled.ul<{ $primary?: boolean, $maxheight?: boolean }>`
align-items: center;
flex-direction: column;
margin-bottom: auto;
gap: 5px;

${props => props.$primary &&
    css`
width: 100%;
`}

@media (max-width: 430px) {
  ${props => props.$maxheight &&
    css`
flex-direction: row;
overflow-y: scroll;
overflow-x: hidden;

&::-webkit-scrollbar {
  display: none;
}
`}
}
`

/* tooltip */
export const TooltipSpan = styled.span<{ $primary?: boolean }>`
  visibility: hidden;
  width: max-content;
  font-weight: bold;
  text-align: center;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: .5rem;
  padding: .25rem .5rem;
  font-size: 14px;
  opacity: 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: 15%;
  left: 100%;

  ${props => props.theme.mode === 'dark' ?
    css`
    background-color: var(--main-color-opacity1);
    color: var(--white-grey-1);
`
    :
    css`
    background-color: var(--main-color-opacity2);
    color: var(--main-color);
`
  }
`

export const TooltipSpanLeft = styled.span<{ $primary?: boolean }>`
  visibility: hidden;
  width: max-content;
  font-weight: bold;
  text-align: center;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: .5rem;
  padding: .25rem .5rem;
  font-size: 14px;
  opacity: 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: 15%;
  left: 100%;

  ${props => props.theme.mode === 'dark' ?
    css`
    background-color: var(--main-color-opacity1);
    color: var(--white-grey-1);
`
    :
    css`
    background-color: var(--main-color-opacity2);
    color: var(--main-color);
`
  }

@media (max-width: 1185px) {
  display: none;
}
`

export const DeviceStateNetwork = styled.span<{ $primary?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 70px;
  max-height: 30px;
  width: max-content;
  height: 30px;
  background-color: #2ecc71;
  color: var(--white);
  padding: 5px;
  border-radius: .5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &>div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  ${props => props.theme.mode === 'dark' &&
    css`
    color: white;
`}

  ${props => props.$primary &&
    css`
    background-color: var(--danger-100);
    color: var(--white);
  `}
`

export const Li = styled.li<{ $primary?: boolean }>`
  position: relative;
  display: inline-block;

  &:hover ${TooltipSpan} {
  ${props => props.$primary &&
    css`
    visibility: visible;
    opacity: 1;
    left: 115%;
    transition: ease .3s;
`}
}

${props => props.$primary &&
    css`
& a {
  gap: unset !important;
}
`}
&& svg{
  font-size: 24px;
}
& a.nav-link.active {
  background-color: var(--main-color) !important;
}

& a.nav-link:hover {
  background-color: var(--main-color) !important;
  color: var(--white-grey-1) !important;
  transition: .3s;
}

& .nav-link:focus-visible {
  box-shadow: 0 0 0 .25rem var(--main-color-opacity2);
}
`

// Line between
export const LineHr = styled.hr<{ $primary?: boolean, $mg?: number }>`
width: 100%;

${porps => porps.$primary && css`
@media (max-width: 430px) {
  display: none;
}
`}

${props => props.$mg === .5 &&
    css`
    margin: .5rem 0;
`}
`

// Navbar
export const Nav = styled.nav`
display: flex;
align-items: center;
justify-content: space-between;
background-color: rgba(255, 255, 255, .7);
backdrop-filter: blur(13px);
-webkit-backdrop-filter: blur(13px);
width: 100%;
height: 60px;
padding: 0 1.5rem 0 1rem;
min-height: 55px;
border-bottom: .5px solid var(--soft-grey);
box-shadow: 0px 15px 10px -15px rgba(0, 0, 0, .05);

${props => props.theme.mode === 'dark' &&
    css`
  background-color: rgba(53, 53, 53, .6);
  border-color: var(--border-dark-color);
  color: var(--white-grey-1);
`}

@media (max-width: 430px) {
  padding: 0 .8rem;
  backdrop-filter: unset;
  -webkit-backdrop-filter: unset;
  background-color: #fcfcfc;

  ${props => props.theme.mode === 'dark' &&
  css`
    background-color: #2f2f2f;
  `}
}
`

export const GlobalsearchInput = styled.input <{ $primary?: boolean }> `
padding: 0 2.5rem;
height: 45px;
width: 280px;
border-radius: var(--border-radius-big);
background-color: ${props => props.theme.mode === 'dark' ? 'rgba(37, 37, 37, .5)' : 'rgba(235, 235, 235, .5)'};
border: unset;
border: 2px solid transparent;
cursor: pointer;

&:hover {
  border-color: var(--main-color);
  outline: none;
  box-shadow: unset !important;
  transition: .3s;
}

&:focus {
  border-color: var(--main-color);
  outline: none;
  box-shadow: unset !important;
  transition: .3s;
}

${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
`}
@media (max-width: 430px) {
  padding: 0 1.5rem;
  height: 55px;
  }
`
export const SearhIconClose = styled.div<{ $primary?: boolean }> `
  position: absolute;
  right: .5rem;
  right: 1rem;
  display: flex;
  cursor: pointer;

  &:hover {
  color: var(--main-color);
  transition: .3s;
}

  & svg {
    font-size: 24px;
  }
`

export const MainMenuSide = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
flex-direction: column;
margin-bottom: auto;
gap: 5px;

@media (max-width: 430px) {
  display: none;
}
`

export const GlobalsearchContainer = styled.div <{ $primary?: boolean }> `
position: relative;
display: flex;
align-items: center;
max-width: 300px;
overflow: hidden;

@media (max-width: 430px) {
  display: none;
  }
`

export const SearhIcon = styled.div<{ $primary?: boolean }> `
  position: absolute;
  left: .7rem;
  display: flex;

  & svg {
    font-size: 24px;
    color: var(--grey-75);

    ${props => props.theme.mode === 'dark' &&
    css`
      color: var(--white-grey-1);
`}
  }
`

export const Navleft = styled.div<{ $primary?: boolean }> `
display: flex;
align-items: center;
gap: .5rem;
`

export const GlobalsearchContainerMB = styled.div<{ $primary?: boolean }> `
  position: absolute;
  visibility: ${props => props.$primary ? 'visible' : 'hidden'};
  top: 0;
  left: 0;
  height: ${props => props.$primary ? '100px' : '0'};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: .5rem;
  width: ${props => props.$primary ? '100%' : '200px'};
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);
  opacity: ${props => props.$primary ? 1 : 0};
  z-index: 15;
  transition: .3s;

${props => props.$primary &&
    css`
  ${props => props.theme.mode === 'dark' &&
        css`
background-color: var(--main-last-color);
`}
`}



& svg:nth-child(2) {
  position: absolute;
  left: 75px;
  font-size: 24px;
  color: var(--grey-75);
}
`

export const MBSearchClearIcon = styled.div<{ $primary?: boolean }>`
position: absolute;
right: 110px;

& svg {
  font-size: 20px;
}
`

export const MBSearchCloseIcon = styled.div<{ $primary?: boolean }>`
& svg {
  font-size: 24px;
  color: black;

  ${props => props.theme.mode === 'dark' &&
    css`
color: var(--white-grey-1);
`}
}
`

export const GlobalsearchMBIcon = styled.div<{ $primary?: boolean }> `
  display: none;
  cursor: pointer;

@media (max-width: 430px) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;

  & svg {
    font-size: 24px;
  }
  }
`

export const NavRight = styled.div<{ $primary?: boolean }> `
display: flex;
align-items: center;
gap: .8rem;

@media (max-width: 430px) {
  &>div:nth-child(2),
  &>div:nth-child(3),
  &>button:nth-child(4),
  &>div:nth-child(5),
  &>div:nth-child(6) {
    display: none;
  }
}
`

export const NavLogout = styled.div<{ $primary?: boolean }> `
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  height: 40px;
  max-height: 40px;
  border-radius: var(--border-radius-small);
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;
color: red;

&:hover {
  background-color: red;
  color: var(--white-grey-1);
  transition: .3s;
}

& svg {
  font-size: 18px;
}
`

export const NavProfileContainer = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: .5rem;
  width: 100%;
  max-height: 80px;
  border-radius: var(--border-radius-small);
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
  color: var(--white-grey-1);
  background-color: var(--main-color);
  transition: .3s;
}

&>div {
  display: flex;
  flex-direction: column;
  align-items: start;
}

  @media (max-width: 430px) {
  & span {
    display: none;
  }
  & svg {
    display: none;
  }
}

  & span {
    font-size: 14px;
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & span:nth-child(2) {
    font-size: 12px;
    font-weight: bold;
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  div>span {
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  div>strong {
    font-size: 14px;
  }

  ${props => props.theme.mode === 'dark' &&
    css`
color: var(--white-grey-1);
`}
`

export const NavProfileFlex = styled.div<{ $primary?: boolean }>`
`

export const NavProfile = styled.img<{ $primary?: boolean }>`
  background-color: var(--white-grey-1);
  max-width: 35px;
  max-height: 35px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  padding: 1px;
  box-sizing: border-box;
  object-fit: cover;

  ${props => props.$primary && css`
  max-width: 24px;
  max-height: 24px;
  `}
`

export const LangSwitch = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  background-color: unset;
  border: unset;
  color: var(--black);
  font-size: 24px;
  width: 35px;
  height: 35px;
  position: relative;

  ${props => props.theme.mode === 'dark' &&
    css`
color: var(--white-grey-1);
`}

  &:hover {
  color: var(--main-color);
  transition: .3s;
}
`

export const LangText = styled.div<{ $primary?: boolean }>`
font-size: 10px;
bottom: 0;
left: 22px;
font-weight: bold;
position: absolute;
`

export const LangSwitchContainer = styled.div<{ $primary?: boolean }>`
  display: flex;
  justify-content: right;
  align-items: center;
`

export const NavRightPipe = styled.div<{ $primary?: boolean }>`
width: 1.5px;
max-width: 1.8px;
max-height: 25px;
height: 25px;
border-radius: 1px;
background-color: var(--text-loading);
`

// permission
export const FormBtn = styled.button<{ $primary?: boolean }> `
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
width: max-content;
max-height: 50px;
border-radius: var(--border-radius-big);
border: 2px solid transparent;
background-color: var(--main-color);
color: var(--white);
font-weight: bold;
padding: .5rem .8rem;

&:hover {
  background-color: var(--second-color);
  transition: .3s;
}

& svg {
  stroke-width: 1px;
}
`

export const FormFlexBtn = styled.div<{ $primary?: boolean }> `
`

export const AddUserButton = styled.button<{ $primary?: boolean }> `
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
border-radius: var(--border-radius-big);
border: 2px solid transparent;
background-color: var(--main-color);
color: var(--white);
font-weight: bold;
padding: .5rem .8rem;

&:hover {
  background-color: var(--second-color);
  transition: .3s;
}

${props => props.$primary && css`
  padding: unset;
  width: 36px;
  height: 36px;
`}

& svg {
  stroke-width: 1px;
}
`

export const DelUserButton = styled.button<{ $primary?: boolean }> `
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
border-radius: var(--border-radius-big);
border: 2px solid transparent;
background-color: var(--danger-color);;
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

export const Reactive = styled.button<{ $primary?: boolean }> `
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
border-radius: var(--border-radius-big);
border: 2px solid transparent;
background-color: var(--main-color);
color: var(--white);
font-weight: bold;
padding: .5rem;

&:hover {
  background-color: var(--second-color);
  transition: .3s;
}

& svg {
  stroke-width: 1px;
}
`

export const DelWarrantyButton = styled.button<{ $primary?: boolean }> `
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
width: max-content;
max-width: 165px;
max-height: 45px;
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

export const CardUserHead = styled.div<{ $primary?: boolean }> `
display: flex;
align-items: start;
flex-wrap: wrap;

  &>div {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  width: 100%;
}

&>div>div:nth-child(2) {
  display: flex;
  align-items: center;
  gap: .5rem;

  &>div {
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  @media (max-width: 430px) {
  flex-direction: column-reverse;
  align-items: end;

  &>div {
    flex-direction: column;
    align-items: end;
  }
}
}

& h3 {
  margin-bottom: unset;
}
`

export const CardUserBody = styled.div<{ $primary?: boolean }> `
display: grid;
grid-template-columns: repeat(5, 1fr);
overflow-wrap: break-word;
gap: 1rem;
padding: 1rem;

@media (max-width: 1185px) {
  grid-template-columns: ${props => props.$primary ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)'};
}

@media (max-width: 430px) {
  grid-template-columns: repeat(1, 1fr);
}
`

export const UserMenu = styled.div<{ $primary?: boolean }> `
display: flex;
flex-direction: column;
align-items: center;
gap: .5rem;

& div>button::after {
  display: none;
}

.dropdown-item:active {
  background-color: unset;
}
`

export const UsercardFlex = styled.div<{ $primary?: boolean }> `
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  height: 100px;
  border-radius: .8rem;
  padding: 1rem;
  background-color: var(--white-grey-1);
  box-shadow: 0 12px 28px ${props => props.theme.mode === 'dark' ? 'rgb(50 50 50 / 10%)' : 'rgb(190 190 190 / 25%)'};

  &>div:nth-child(1) {
    display: flex;
    gap: 1rem;
  }

  ${props => props.theme.mode === 'dark' &&
    css`
      background-color: var(--main-last-color);
`}

  ${UserMenu}>div:hover {
    & svg {
      color: var(--black);
      transition: .3s;
    }
  }
`

export const Userimage = styled.img<{ $primary?: boolean }> `
max-width: 60px;
max-height: 60px;
width: 60px;
height: 60px;
border-radius: var(--border-radius-big);
box-shadow: 0 0 5px 2px rgba(0, 0, 0, .05);
background-color: var(--white-grey-1);
object-fit: cover;
`

export const UserDetails = styled.div<{ $primary?: boolean }> `
display: flex;
flex-direction: column;

& span {
  max-width: 80px;
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

& span:nth-child(1) {
  color: var(--main-last-color);
  font-size: 14px;

  ${props => props.theme.mode === 'dark' &&
    css`
      color: var(--white-grey-1);
`}
}
& span:nth-child(2) {
  color: var(--grey);
  font-size: 14px;
}
& span:nth-child(3) {
  font-size: 14px;
  font-weight: bold;
  ${props => props.theme.mode === 'dark' &&
    css`
      color: var(--soft-grey);
`}
}
`

export const CardmenuIcon = styled.div<{ $primary?: boolean }> `
cursor: pointer;

& svg {
  font-size: 20px;
  color: var(--grey);
}
`

export const PaginitionContainer = styled.div<{ $primary?: boolean }> `
display: flex;
align-items: center;
justify-content: space-between;

@media (max-width: 430px) {
  flex-direction: column;
  align-items: unset;
  gap: .5rem;

  & div:nth-child(2) {
    align-items: center;
  }
}
`

export const PaginitionFlex = styled.div<{ $primary?: boolean }> `
display: flex;
align-items: center;
flex-wrap: wrap;
gap: 1rem;
`

export const PaginitionButton = styled.button<{ $primary?: boolean }> `
display: flex;
align-items: center;
justify-content: center;
background-color: unset;
max-width: 35px;
max-height: 35px;
width: 35px;
height: 35px;
border: unset;
border-radius: var(--border-radius-big);

&:disabled>svg {
  color: var(--grey);
}

& svg {
  font-size: 24px;
  color: black;

  ${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
`}
}

&:hover {
  background-color: var(--soft-grey);
}

${props => props.theme.mode === 'dark' &&
    css`
&:hover {
    background-color: var(--main-last-color);
}
`}
`

export const PaginitionSelect = styled.select<{ $primary?: boolean }> `
background-color: unset;
max-width: 50px;
max-height: 25px;
border: unset;
color: black;

&:focus,
&:focus-visible {
  border: unset;
}

${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
    background-color: var(--main-seccond-color);
`}
`

export const PaginitionFlexOne = styled.div<{ $primary?: boolean }> `
display: flex;
align-items: center;
gap: 5px;
`

export const PaginitionFlexTwo = styled.div<{ $primary?: boolean }> `
display: flex;
align-items: center;
gap: 1rem;
`

// manage hospitals
export const ManageHospitalsContainer = styled.div<{ $primary?: boolean }>`

`

export const HosTableImage = styled.img<{ $primary?: boolean }>`
width: 45px;
height: 45px;
padding: 5px;
`

export const ManageHospitalsAdd = styled.button<{ $primary?: boolean }>`
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

&:hover {
  background-color: var(--second-color);
  transition: .3s;
}

${props => props.$primary && css`
padding: unset;
width: 36px;
height: 36px;
`}

& svg {
  stroke-width: 1px;
}
`

export const ManageWardAdd = styled.button<{ $primary?: boolean }>`
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

export const ManageWardHeader = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: space-between;

& h3 {
  margin-bottom: unset;
}
`

export const ManageHospitalsHeader = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: space-between;

& h3 {
  margin-bottom: unset;
}

@media (max-width: 430px) {
    align-items: unset;
    gap: 1rem;

    &>div:nth-child(2) {
      justify-content: end;
    }
}
`

export const ManageHospitalsHeaderAction = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: .5rem;

@media (max-width: 430px) {
  flex-direction: column;
  align-items: end;
}
`

export const SpanStatusDev = styled.span<{ $primary?: boolean }>`
background-color: ${props => props.$primary ? 'var(--danger-color)' : 'var(--main-color)'};
color: var(--white-grey-1);
border-radius: var(--border-radius-small);
padding: .35rem .5rem;
`

export const ManageHospitalsBody = styled.div<{ $primary?: boolean }>`
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

export const ManageHistoryBody = styled.div<{ $primary?: boolean }>`
  display: grid;
  grid-template-columns: auto;
  gap: 1rem;

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

export const ManageDeviceBody = styled.div<{ $primary?: boolean }>`
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

export const Actiontablehos = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: .5rem;
`

// manage hospitals
export const AddDevices = styled.button<{ $primary?: boolean }>`
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

export const ManageDevicesContainer = styled.div<{ $primary?: boolean }>`
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

export const Actiontabledev = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: .5rem;
`

export const ManageDevSpanUnsetUserSelect = styled.span<{ $primary?: boolean }>`
user-select: text;
-webkit-user-select: text;
cursor: pointer;

&:hover {
  text-decoration: underline;
  transition: .3s;
}
`

// datatable filter
export const DataTableFilterContainer = styled.div<{ $primary?: boolean }>`

`

export const SearchButton = styled.button<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: center;
max-height: 35px;
max-width: 35px;
height: 30px;
width: 30px;
border-radius: var(--border-radius-big);
background-color: unset;
border: unset;
position: absolute;
right: 10px;
cursor: pointer;

& svg {
  font-size: 20px;
}
`

export const SearchInput = styled.input<{ $primary?: boolean }>`
padding: 0 2rem;
max-height: 40px;
max-width: 230px;
height: 40px;
width: 200px;
border-radius: var(--border-radius-big);
background-color: unset;
border: 1px solid var(--grey);

&:focus {
  outline: none;
}
`

export const SearchFlex = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
position: relative;
width: max-content;

& svg {
  position: absolute;
  left: 10px;
}
`

// lang
export const LangFlagFlex = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: start;
gap: .7rem;
`

export const LangFlag = styled.img<{ $primary?: boolean }>`
max-width: 24px;
max-height: 24px;
`

// Devicecs
export const DevCards = styled.div<{ $primary?: boolean }>`

`

export const DevCardContainer = styled.div<{ $primary?: boolean, $eventcount?: boolean, $responsivecard?: boolean }>`
display: flex;
flex-direction: column;
justify-content: center;
gap: 5px;
background-color: var(--white-grey-1);
width: 145px;
height: max-content;
max-width: 150px;
max-height: 130px;
overflow: hidden;
padding: .8rem;
border-radius: .8rem;
box-shadow: 0 12px 28px ${props => props.theme.mode === 'dark' ? 'rgb(50 50 50 / 10%)' : 'rgb(190 190 190 / 25%)'};
transition: .3s;
cursor: pointer;

&:hover {
  transform: scale(1.05);
  transition: .3s;
}

${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);
`}

${props => props.$primary && css`
  background-color: var(--main-color);
  color: var(--white-grey-1);
  transition: .3s;

  ${DevCards} & span:nth-child(2) {
    color: var(--white);
  }
`}

& span {
  font-size: 14px;
}

& h4 {
  text-align: center;
  font-weight: bold;
  margin-bottom: 0;
}


span:nth-child(2) {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  }

${props => props.$eventcount &&
    css`
span:nth-child(2) {
  color: var(--danger-color);
}
`}

${props => props.$responsivecard &&
    css`
  width: 155px;
  max-width: 155px;
  transition: .3s;
`}
`

export const DevCardFooter = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: space-between;
flex-wrap: wrap;
padding: 0 .5rem;


& span {
  font-size: 12px;
}
`

export const CardSpan = styled.span<{ $primary?: boolean }>`
  max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const CardHomeFlex = styled.div`
display: block;
aspect-ratio: 100 / 130;
border-radius: .5rem;
max-width: 100px;
max-height: 130px;
overflow: hidden;
`

export const DevHomeSecctionOne = styled.div<{ $primary?: boolean, $expand?: boolean, $inList?: boolean }>`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: .5rem;
margin-top: 1rem;
position: sticky;
top: 60px;
height: ${props => props.$expand ? '55.38px' : props.$inList ? 'max-content' : '195.19px'};
padding: 1rem;
z-index: 100;
background-color: ${props => props.theme.mode === 'dark' ? 'rgba(37, 37, 37, .6)' : 'rgba(245, 245, 245, .7)'};
backdrop-filter: blur(13px);
-webkit-backdrop-filter: blur(13px);
border-bottom: ${props => props.$primary ? `1px solid ${props.theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--soft-grey)'}` : 'unset'};
transition: height .3s;

&>div:nth-child(1) {
  display: ${props => props.$expand ? 'none' : 'flex'};
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: .5rem;
}

&>div:nth-child(2) {
  display: ${props => !props.$primary ? 'none' : 'flex'};
  justify-content: center;
  align-items: center;
  margin-top: .5rem;
  width: 100%;

  &>svg:hover {
    opacity: .5;
    transition: .3s;
  }

  &>svg {
    cursor: pointer;
  }
}

@media (max-width: 1185px) {
  gap: .5rem;
  padding: .7rem;
  height: ${props => props.$expand ? '55.38px' : '290.55px'};

  &>div:nth-child(1) {
    display: ${props => props.$expand ? 'none' : 'grid'};
    grid-template-columns: repeat(4, 0fr);
    justify-items: center;
  }
}

@media (max-width: 430px) {
  position: unset;
  padding: 1rem;
  border-bottom: unset;
  height: max-content;

  &>div:nth-child(1) {
    display: grid;
    grid-template-columns: repeat(2, 0fr);
    justify-items: center;
    gap: 1rem;
  }

  &>div:nth-child(2) {
    display: none;
  }
}
`

export const DevHomeHead = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: 1rem;
z-index: 99;

&>div:nth-child(2) {
  display: flex;
  gap: .5rem;
}

@media (max-width: 430px) {
  flex-direction: column-reverse;
  align-items: end;
  gap: .5rem;

  &>div:nth-child(2) {
    display: flex;
    gap: .5rem;
  }

  &>div:nth-child(1) {
    display: flex;
    flex-direction: column;
    align-items: end !important;
    gap: .5rem !important;
  }
}

&>div:nth-child(1) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
`

export const ProbeHead = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: 1rem;
z-index: 99;
background-color: red;
margin-bottom: 1.5rem;
width: 100%;

@media (max-width: 430px) {
  gap: .5rem;
}

&>div:nth-child(1) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
`

export const DevHomeHeadTile = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: space-between;
align-items: center;
flex-wrap: wrap;
margin-top: 1rem;

& h5 {
  margin-bottom: 0;
}
`

export const HomeContainerFlex = styled.div<{ $primary?: boolean }>`
  height: 100%;
  margin-bottom: 1rem;
`

export const DevHomeDetails = styled.div<{ $primary?: boolean, $limitListFlex?: boolean }>`
display: flex;
align-items: center;
/* justify-content: center; */
flex-direction: column;
gap: .5rem;
margin-top: 1rem;

${props => props.$limitListFlex ? 'justify-content: start;' : props.$primary ? 'justify-content: center;' : 'justify-content: center;'}

/* &>div:nth-child(1) {
  height: calc(100dvh - 450px);
  overflow-y: scroll;
} */

& > div:nth-child(2) {
  margin-top: 1rem;
  width: 100%;
}

& > div:nth-child(1) {
  display: ${props => props.$primary ? 'flex' : 'grid'};
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  max-width: 1480px;

  @media (max-width: 1185px) {
  grid-template-columns: repeat(3, 0fr);
}

  @media (max-width: 430px) {
  grid-template-columns: repeat(1, 0fr);
}
}

@media (max-width: 430px) {
  & > div:nth-child(1) {
    justify-content: center;
  }
}
`

export const RangeInputText = styled.input<{ $primary?: boolean }>`
width: 80px;
height: 35px;
border-radius: .5rem;
padding:  0 5px 0 0;
text-align: end;
font-weight: bold;
border: unset;

${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);
    color: var(--white-grey-1);
`}

&:focus {
  outline: unset;
  border: 2px solid var(--main-color);
}
`

export const SliderFlex = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: space-between;
`

export const SliderLabelFlex = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
align-items: center;
`

export const SliderRangeFlex = styled.div<{ $rangename?: string }>`
${props => props.$rangename === 'temp' &&
    css`
    span {
      color: var(--danger-color);
    }
    span>span:nth-child(3),
    span>span:nth-child(4) {
    &:hover {
      box-shadow: 0px 0px 0px 8px rgba(231, 76, 60, 0.16);
}
    }
`}

${props => props.$rangename === 'hum' &&
    css`
    span {
      color: var(--main-color);
    }
    span>span:nth-child(3),
    span>span:nth-child(4) {
    &:hover {
      box-shadow: 0px 0px 0px 8px var(--main-color-opacity1);
}
    }
`}
`

export const AboutBox = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: space-between;
align-items: center;
gap: .5rem;
margin: 1rem 0;
height: 45px;
padding: 0 .5rem 0 0;

@media (max-width: 430px) {
  height: max-content;
  flex-direction: column;
  align-items: unset;
}

& h5 {
  margin-bottom: unset;
}
`

export const DeviceCard = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
gap: .5rem;
width: 230px;
height: max-content;
max-width: 230px;
max-height: 380px;
padding: 1rem;
border-radius: .8rem;
background-color: var(--white-grey-1);
box-shadow: 0 12px 28px ${props => props.theme.mode === 'dark' ? 'rgb(50 50 50 / 10%)' : 'rgb(190 190 190 / 25%)'};

${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);
`}

@media (max-width: 430px) {
  max-width: 300px;
  width: 270px;
}
`

export const DeviceCardHeadHandle = styled.div<{ $primary?: boolean }>`
display: flex;
gap: .5rem;
`

export const CardDevBtn = styled.button<{ $primary?: boolean }>`
  max-width: 25px;
  max-height: 25px;
  background-color: unset;
  border: unset;
  color: black;
  position: relative;

  ${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
`}

  & svg {
  font-size: 24px;
  stroke: .1px;
  }

&:hover {
  & svg {
  color: var(--main-color);
  transition: .3s;
  }
}
`

export const DeviceCardHead = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: space-between;
align-items: center;
width: 100%;
max-height: 150px;
`
export const DeviceCardBody = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
width: 100%;

& h5 {
  margin-bottom: unset;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

& span {
  font-size: 14px;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
`

export const DeviceCardFooter = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
gap: .5rem;
width: 100%;
`

export const CardDoorSection = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
`

export const DeviceCardHeadImg = styled.img<{ $primary?: boolean }>`
width: 100px;
height: 130px;
object-fit: cover;
`

export const DeviceCardHeadStatus = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
align-items: end;
gap: .5rem;
width: 50%;
height: 130px;
`

export const DeviceCardFooterDoorFlex = styled.div<{ $primary?: boolean }>`
display: flex;
position: relative;
gap: .5rem;
width: max-content;

&:hover ${TooltipSpan} {
  visibility: visible;
  opacity: 1;
  left: 115%;
  transition: ease .3s;
}

${props => props.$primary &&
    css`
padding: .5rem;

div {
  max-width: 24px;
  max-height: 24px;
  border-radius: 0.4rem;

  svg {
    font-size: 18px;
  }
}
`}
`

export const DeviceCardFooterDoor = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: center;
align-items: center;
max-width: 32px;
max-height: 32px;
width: 32px;
height: 32px;
background-color: var(--white-grey-1);
border-radius: .5rem;
border: 1px solid var(--grey);
overflow: hidden;

${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);
`}

& svg {
  font-size: 20px;
  color: var(--black);

  ${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
`}
}

${props => props.$primary &&
    css`
    background-color: var(--danger-color);
    border-color: var(--danger-color);

  & > span {
    color: var(--white-grey-1);
  }

  & > svg {
    color: var(--white-grey-1);
  }
`}
`

export const DeviceCardFooterTemp = styled.div<{ $primary?: boolean }>`
display: flex;
gap: .5rem;
`

export const DeviceCardFooterI = styled.div<{ $primary?: boolean }>`
display: flex;
gap: .5rem;
`

export const DeviceCardFooterTempT = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: center;
align-items: center;
max-width: 80px;
max-height: 32px;
width: max-content;
height: 32px;
padding: 0 5px;
font-size: 14px;
border-radius: .5rem;
background-color: var(--white-grey-1);
border: 1px solid var(--grey);
position: relative;

&:hover ${TooltipSpan} {
  visibility: visible;
  opacity: 1;
  left: 115%;
  transition: ease .3s;
}

${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);
`}
`

export const DeviceCardFooterInfo = styled.div<{ $primary?: boolean, $size?: boolean, $onFilter?: boolean }>`
display: flex;
justify-content: center;
align-items: center;
gap: 5px;
max-width: ${props => props.$onFilter ? '50px' : 'max-content'};
max-height: ${props => props.$onFilter ? '80px' : '32px'};
width: ${props => props.$onFilter ? '50px' : 'max-content'};
height: ${props => props.$onFilter ? 'max-content' : '32px'};
font-size: 14px;
border-radius: .5rem;
padding: ${props => props.$onFilter ? '5px' : '0'} 5px;
background-color: var(--white-grey-1);
border: 1px solid var(--grey);
position: relative;

&>div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

&:hover ${TooltipSpan} {
  visibility: visible;
  opacity: 1;
  left: 115%;
  transition: ease .3s;
}

${props => props.$size &&
    css`
    max-width: 24px;
    max-height: 24px;

    svg {
      font-size: 18px;
    }
`}

${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);
`}

& svg {
  font-size: 20px;
  color: var(--black);

  ${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
`}
}

${props => props.$primary &&
    css`
  background-color: var(--danger-color);
  border-color: var(--danger-color);

  & span {
    color: var(--white-grey-1);
  }

  & svg {
    color: var(--white-grey-1);
  }
`}
`

export const FormRangeLabel = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
align-items: center;
`

// modal head
export const ModalHead = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: space-between;
align-items: center;
width: 100%;
padding: 0 .5rem 0 0;

${props => props.$primary && css`
  &>div:nth-child(1) {
  display: flex;
  flex-direction: column;
}
`}

& button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: unset;
  border: unset;
  width: 24px;
  height: 24px;
  color: var(--main-last-color);

  ${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
`}

  & svg {
    font-size: 24px;
  }
}

& button:hover {
  & svg {
    color: var(--grey);
    transition: .3s;
  }
}
`

// card data
export const DeviceInfoSpan = styled.span<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: 5px;
color: black;
cursor: pointer;

${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
`}

& svg {
  font-size: 18px;
}
`

export const DeviceInfoSpanClose = styled.span<{ $primary?: boolean }>`
color: black;
cursor: pointer;

${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
`}

& svg {
  font-size: 24px;
}
`

export const DeviceInfoflex = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: .8rem;

@media (max-width: 430px) {
  justify-content: space-between;
}
`

export const FormSliderRange = styled.div<{ $primary?: string, $disabled?: boolean }>`

  ${props => props.$primary === 'temp' ?
    css`
  span {
      color: var(--danger-color);
    }
    span>span:nth-child(3),
    span>span:nth-child(4) {
    &:hover {
      box-shadow: 0px 0px 0px 8px rgba(231, 76, 60, 0.16);
}
    }
  `:
    css`
span {
      color: var(--main-color);
    }
    span>span:nth-child(3),
    span>span:nth-child(4) {
    &:hover {
      box-shadow: 0px 0px 0px 8px var(--main-color-opacity1);
}
    }
`}

${props => props.$disabled &&
    css`
opacity: .3;
`}
`

// Dashboard
export const DashboardFlex = styled.div<{ $primary?: boolean }>`
width: 100%;
`

export const ExpandPicture = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: center;
align-items: center;
width: 100%;
max-width: 1110px;
border-radius: .8rem;
overflow: hidden;

@media (max-width: 430px) {
  img {
    max-width: 330px;
  }
}
`

export const DashboardHeadFilter = styled.div<{ $primary?: boolean }>`
margin-top: 1rem;
display: grid;
align-items: center;
grid-template-columns: repeat(2, 1fr);

&>div:nth-child(1) {
  width: 50%;
}

&>div:nth-child(2) {
  display: flex;
  justify-content: right;
}

@media (max-width: 1185px) {
  grid-template-columns: repeat(1, 1fr);
  width: unset;
}

${props => props.theme.mode === 'dark' &&
    css`
    select {
      background-color: var(--main-last-color);
      color: var(--white-grey-1);
      border-color: var(--border-dark-color);
      color-scheme: dark;
    }
`}
`
export const DashboardDevicesInfo = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: start;
gap: 1rem;
margin-top: 1rem;
width: 100%;

@media (max-width: 430px) {
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 1185px) {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}
`

export const DashboardDevicesDetails = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
flex-wrap: wrap;
width: 40%;
gap: 1rem;
padding: 1rem;
background-color: var(--white-grey-1);
border-radius: .8rem;
box-shadow: 0 12px 28px ${props => props.theme.mode === 'dark' ? 'rgb(50 50 50 / 10%)' : 'rgb(190 190 190 / 25%)'};

${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);
`}

@media (max-width: 430px) {
  width: 100%;
}

@media (max-width: 1185px) {
  width: 100%;
}
`

export const SpanCardDash = styled.div`
  display: flex;
  gap: .3rem;
`

export const DeviceDetailsHead = styled.div<{ $primary?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: .5rem .5rem 0 0;

${props => props.theme.mode === 'dark' &&
    css`
    button {
      svg {
        color: var(--white-grey-1);
      }
    }
`}

&div:nth-child(1) {
  display: flex;
  flex-direction: column;

  span {
    max-width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

button {
  color: black;
  background-color: unset;
  border: unset;
}

button:hover {
& svg {
  color: var(--main-color);
  transition: .3s;
}
}

button>svg {
  font-size: 24px;
}
`

export const DeviceDetailsBody = styled.div<{ $primary?: boolean }>`
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 1rem;

@media (max-width: 1185px) {
  grid-template-columns: repeat(1, 1fr);
}
`

export const DeviceDetailsBodyimg = styled.img<{ $primary?: boolean }>`
width: 100%;
height: 180px;
aspect-ratio: 3/4;
border-radius: var(--border-radius-big);
padding: 3px;
box-shadow: 0 12px 28px ${props => props.theme.mode === 'dark' ? 'rgb(50 50 50 / 10%)' : 'rgb(190 190 190 / 25%)'};
cursor: pointer;
overflow: hidden;

&:hover {
  transform: scale(.95);
  transition: transform ease .3s;
}

@media (max-width: 1185px) {
  height: 200px;
}
`

export const DeviceDetailsBodyInfo = styled.div<{ $primary?: boolean }>`
  width: 100%;

  div {
    display: flex;
    flex-direction: column;
    gap: .3rem;

    span {
      font-size: 16px;
    }
  }

  div>li:nth-child(1) {
    max-height: 45px;
    overflow: hidden;
  }
`

export const DevicesBodyStatus = styled.div<{ $primary?: boolean }>`
display: grid;
grid-template-columns: repeat(5, 1fr);
justify-items: center;
width: 60%;
gap: 1rem;

@media (max-width: 430px) {
  grid-template-columns: repeat(2, .5fr);
  justify-content: center;
  width: 100%;
}

@media (max-width: 1185px) {
  width: 100%;
}
`

export const DashBoardCardFlex = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
gap: .5rem;
width: 100%;
height: 135px;
padding: .5rem;
background-color: var(--white-grey-1);
border-radius: .8rem;
box-shadow: 0 12px 28px ${props => props.theme.mode === 'dark' ? 'rgb(50 50 50 / 10%)' : 'rgb(190 190 190 / 25%)'};
overflow: hidden;

${props => props.$primary && css`
  &:hover {
    &>div:nth-child(1)>svg {
      background-color: var(--second-color);
    }

    cursor: pointer;
    background-color: var(--main-color);
    color: var(--white-grey-1);
    transition: .3s;
  }
`}

${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);
`}

@media (max-width: 430px) {
  width: 100%;
  height: 130px;
}
`

export const DashBoardCardHead = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: .5rem;
height: 30%;

svg {
  font-size: 28px;
  padding: 5px;
  border-radius: .5rem;
  background-color: var(--soft-grey);

  ${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-seccond-color);
`}
}
`

export const DashBoardCardBody = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 5px;

div{
  max-width: 155px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

div>sub {
  font-size: 16px;
  font-weight: bold;
}
`

export const DashBoardCardSpan = styled.span<{ $primary?: boolean, $alertone?: boolean, $alerttwo?: boolean }>`
display: flex;
justify-content: center;
align-items: center;
font-weight: bold;
font-size: 18px;
gap: 5px;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;


${props => props.$alertone &&
    css`
  color: var(--danger-color);
`}

${props => props.$primary &&
    css`
margin-top: .7rem;
`}

@media (max-width: 430px) {
  font-size: 18px;
}
`

export const DashBoardCardSpanTitle = styled.span<{ $primary?: boolean }>`
  /* max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */
`

export const Dashboardanalys = styled.div<{ $primary?: boolean }>`
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 1rem;
margin-top: 1rem;
width: 100%;

@media (max-width: 430px) {
  grid-template-columns: repeat(1, 1fr);
}

@media (max-width: 1185px) {
  grid-template-columns: repeat(1, 1fr);
  justify-items: center;
  gap: 1rem;
}
`

// chart
export const ChartContainer = styled.div<{ $primary?: boolean }>`
  padding: 1rem;
  background-color: var(--white-grey-1);
  border-radius: 0.8rem;
  box-shadow: 0 12px 28px ${props => props.theme.mode === 'dark' ? 'rgb(50 50 50 / 10%)' : 'rgb(190 190 190 / 25%)'};
  width: 100%;
  height: max-content;
  overflow: hidden;

  ${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);
`}

  @media (max-width: 430px) {
  width: 100%;
  max-width: unset;
}
`

export const ChartCardHeahBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: unset;
  border: unset;
  width: 20px;
  height: 20px;

  &:hover {
    svg {
      color: var(--main-color);
      transform: scale(1.1);
      transition: .3s;
    }
  }

  svg {
    color: black;
    font-size: 20px;

    ${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
`}
  }
`
export const ChartCardHeah = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: .5rem;
  padding: 0 .5rem;
`

export const LineChartController = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
  padding: .5rem;
  box-sizing: border-box;
  width: 100%;

  ${props => props.$primary &&
    css`
  justify-content: center;
  `}
`

export const LineChartControllerBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 17px;
  font-size: 12px;
  user-select: none;
  background-color: unset;
  border: unset;
  color: black;
  cursor: pointer;
`

export const LineChartControllerDimension = styled.div<{ $color?: string }>`
  width: 35px;
  height: 15px;
  border-radius: .3rem;

  ${props => props.$color === 'door' ?
    css`
  border: 2px solid #F1C40F;
  background-color: rgba(241, 196, 15, 0.5);
  `
    :
    props.$color === 'temp' ?
      css`
  border: 2px solid #E74C3C;
  background-color: rgba(231, 76, 60 , 0.5);
`
      :
      css`
  border: 2px solid var(--main-color-opacity1);
  background-color: var(--main-color-opacity1);
`}
`

export const DisabledChartDimension = styled.span`
height: 17px;

${props => props.theme.mode === 'dark' &&
    css`
    color: var(--white-grey-1);
`}
`

export const DisabledChart = styled.div<{ $primary?: boolean }>`
  ${props => props.$primary &&
    css`
    width: 100%;
    height: 1.5px;
    background-color: rgba(0, 0, 0, .5);
    transform: translateY(-.55rem);

    ${props => props.theme.mode === 'dark' &&
        css`
    background-color: var(--white-grey-1);
`}
  `}
`

// table
export const TableContainer = styled.div<{ $primary?: boolean }>`
  padding: 1rem;
  background-color: var(--white-grey-1);
  border-radius: 0.8rem;
  box-shadow: 0 12px 28px ${props => props.theme.mode === 'dark' ? 'rgb(50 50 50 / 10%)' : 'rgb(190 190 190 / 25%)'};
  width: 100%;
  max-height: 540px;
  overflow-y: scroll;

  ${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);

    div>div>div>div>div {
      background-color: var(--main-last-color);
      color: var(--white-grey-1);
    }

    div>nav {
      background-color: var(--main-last-color);
      color: var(--white-grey-1);

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

    div {
      border-radius: unset;
    }
`}

  @media (max-width: 430px) {
    width: 100%;
    max-width: unset;
}
`

export const FulltableContainer = styled.div<{ $primary?: boolean }>`
@media (max-width: 1185px) {
  display: grid;
  grid-template-columns: auto;
  gap: 1rem;
}

div:nth-child(1)>div>div>div>div {
      background-color: var(--bg-grey);
    }

    div>nav {
      background-color: var(--bg-grey);
    }

${props => props.theme.mode === 'dark' &&
    css`
    background-color: var(--main-last-color);

    div:nth-child(1)>div>div>div>div {
      background-color: var(--main-seccond-color);
      color: var(--white-grey-1);
    }

    div>nav {
      background-color: var(--main-seccond-color);
      color: var(--white-grey-1);

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

// loader
export const LoadingData = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
gap: .5rem;
height: calc(100dvh - 150px);
width: 100%;

span {
  font-size: 24px;
}
`

export const LoadingSVGspin = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: center;

svg {
  font-size: 32px;
  transform: rotate(0deg);
  color: black;
  ${props => props.theme.mode === 'dark' &&
    css`
color: var(--white-grey-1);
`}
  ${props => props.$primary === true &&
    css`
  animation: rotateAnimation 2s linear infinite;
  `}
}

${props => props.$primary === true &&
    css`
  @keyframes rotateAnimation {
  0% {
    color: var(--second-color);
    transform: rotate(0deg);
  }
  100% {
    color: var(--second-color);
    transform: rotate(360deg);
  }
}
  `
  }

${props => props.theme.mode === 'dark' &&
    css`
  @keyframes rotateAnimation {
  0% {
    color: var(--white-grey-1);
    transform: rotate(0deg);
  }
  100% {
    color: var(--white-grey-1);
    transform: rotate(360deg);
  }
}
  `}
`

// fullchart
export const FullchartHeadExport = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 35px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: 0.5rem .8rem;

  svg {
    font-size: 24px;
  }

  ${props => props.$primary &&
    css`
  background-color: var(--main-color);
  color: var(--white-grey-1);
  `}

  &:hover {
  background-color: var(--second-color);
  transition: .3s;
}
`
export const FullchartHeadBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 35px;
  border-radius: var(--border-radius-big);
  border: 2px solid ${props => props.theme.mode === 'dark' ? 'var(--soft-grey)' : 'var(--grey-75)'};
  background-color: unset;
  color: ${props => props.theme.mode === 'dark' ? 'var(--soft-grey)' : 'var(--grey-75)'};
  font-weight: bold;
  padding: 0.5rem .8rem;

  svg {
    font-size: 24px;
  }

  ${props => props.$primary &&
    css`
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
    color: var(--white-grey-1);
  `}

  &:hover {
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
    color: var(--white-grey-1);
    transition: .3s;
}
`

export const FullcharComparetHeadBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 35px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: 0.5rem 0.8rem;

  &:hover {
    background-color: var(--second-color);
    transition: .3s;
}

  svg {
    font-size: 24px;
  }

  ${props => props.$primary &&
    css`
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
    color: var(--white-grey-1);
  `}
`

export const FullchartHead = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: space-between;
margin-top: 1rem;

  &>div:nth-child(2) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

.dropdown-menu.show>a {
    ${props => props.theme.mode === 'dark' &&
    css`
  color: var(--white-grey-1);
  `}
  }

.dropdown-item {
  display: flex;
  align-items: center;
  gap: .5rem;
  color: black;

  svg {
    font-size: 18px;
    color: var(--main-color);
  }
}

@media (max-width: 430px) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: start;
}
`

export const FullchartHeadLeft = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: .5rem;

&>span {
  display: none;
}

@media (max-width: 430px) {
  flex-direction: column;
  align-items: start;
}
`

export const FullchartBody = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: center;
overflow: hidden;

${props => props.$primary &&
    css`
    margin-top: 1rem;
`}
`

export const FullchartBodyChartCon = styled.div<{ $primary?: boolean }>`
width: 100%;
display: flex;
flex-direction: column;
align-items: center;
height: max-content;

${props => props.$primary &&
    css`
  width: 100%;
`}

@media (max-width: 430px) {
  &>div>div>svg {
  width: max-content;
}
}
`

export const ExportandAuditFlex = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;

  @media (max-width: 430px) {
    flex-direction: column;
    align-items: end;
}
`

export const AuditGraphBtn = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 200px;
  max-height: 35px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--danger-color);
  color: var(--white);
  font-weight: bold;
  padding: 0.5rem 0.8rem;
  position: relative;

  &:disabled {
    opacity: .3;

    &:hover {
      background-color: unset;
    }
  }

  & svg {
    stroke-width: 1px;
  }

  &:hover {
    background-color: var(--danger-color-hover);
    transition: .3s;
  }
`

// full table
export const FulltableHeadBtn = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 35px;
  border-radius: var(--border-radius-big);
  border: 2px solid ${props => props.theme.mode === 'dark' ? 'var(--soft-grey)' : 'var(--grey-75)'};
  background-color: unset;
  color: ${props => props.theme.mode === 'dark' ? 'var(--soft-grey)' : 'var(--grey-75)'};
  font-weight: bold;
  cursor: pointer;
  padding: 0.5rem 0.8rem;

  svg {
    font-size: 24px;
  }

  ${props => props.$primary &&
    css`
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
    color: var(--white-grey-1);
  `}

  &:hover {
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
    color: var(--white-grey-1);
    transition: .3s;
}
`

export const FulltableExportHeadBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 35px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: 0.5rem 0.8rem;

  &:hover {
    background-color: var(--second-color);
    transition: .3s;
}

  svg {
    font-size: 24px;
  }

  ${props => props.$primary &&
    css`
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
    color: var(--white-grey-1);
  `}
`


export const FulltableHead = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: space-between;
margin-top: 1rem;

&>div:nth-child(2) {
  display: flex;
  justify-content: end;
}

@media (max-width: 430px) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: start;
}

.dropdown-menu.show>a {
    ${props => props.theme.mode === 'dark' &&
    css`
  color: var(--white-grey-1);
  `}
  }

.dropdown-item {
  display: flex;
  align-items: center;
  gap: .5rem;
  color: black;

  svg {
    font-size: 18px;
    color: var(--main-color);
  }
}
`

export const FulltableHeadLeft = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
flex-wrap: wrap;
gap: .5rem;

@media (max-width: 430px) {
  display: grid;
  grid-template-columns: auto;
}
`

export const FulltableBody = styled.div<{ $primary?: boolean }>`
margin-top: 1rem;
display: flex;
justify-content: center;
max-width: 100%;
max-height: 100%;
overflow: hidden;
`

export const FulltableBodyChartCon = styled.div<{ $primary?: boolean }>`
width: 95%;
`

// full cahrt
export const FilterSearchBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 35px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: 0.5rem;

  &:hover {
  background-color: var(--second-color);
  transition: .3s;
}
`

export const FilterContainer = styled.div<{ $primary?: boolean }>`
display: flex;
flex-wrap: wrap;
justify-content: center;
gap: .5rem;
margin: 1rem 0;

input {
  width: 35%;
  ${props => props.theme.mode === 'dark' &&
    css`
color-scheme: dark;
background-color: var(--main-last-color);

&:focus {
  background-color: var(--main-last-color);
}
`}
}
`

/* chart plugin */
export const PluginContainer = styled.button<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
width: max-content;
height: 30px;
padding: 5px;
border: 2px solid var(--grey);
background-color: unset;
color: var(--grey);
border-radius: .5rem;

${props => props.$primary && css`
border-color: var(--main-color);

span,
svg {
  color: var(--main-color);
}
`}
`

export const PluginSpan = styled.span`
font-size: 14px;
`

export const FlexAlignControlChart = styled.div<{ $primary?: boolean }>`
display: flex;
flex-wrap: wrap;
gap: 1rem;
`

/* dashboard full table */
export const DoorTableContainer = styled.div<{ $primary?: boolean }>`
display: flex;
gap: 5px;
padding: 5px;
`

/* notification */
export const NotificationContainer = styled.button<{ $primary?: boolean }>`
background-color: unset;
border: unset;
display: flex;
align-items: center;
justify-content: center;
position: relative;
margin-right: 5px;
color: black;
cursor: pointer;

${props => props.$primary &&
    css`
svg {
  animation: ring 7s 1s ease-in-out infinite;
}

@keyframes ring {
  0% {
    transform: rotate(0);
  }

  1% {
    transform: rotate(30deg);
  }

  3% {
    transform: rotate(-28deg);
  }

  5% {
    transform: rotate(34deg);
  }

  7% {
    transform: rotate(-32deg);
  }

  9% {
    transform: rotate(30deg);
  }

  11% {
    transform: rotate(-28deg);
  }

  13% {
    transform: rotate(26deg);
  }

  15% {
    transform: rotate(-24deg);
  }

  17% {
    transform: rotate(22deg);
  }

  19% {
    transform: rotate(-20deg);
  }

  21% {
    transform: rotate(18deg);
  }

  23% {
    transform: rotate(-16deg);
  }

  25% {
    transform: rotate(14deg);
  }

  27% {
    transform: rotate(-12deg);
  }

  29% {
    transform: rotate(10deg);
  }

  31% {
    transform: rotate(-8deg);
  }

  33% {
    transform: rotate(6deg);
  }

  35% {
    transform: rotate(-4deg);
  }

  37% {
    transform: rotate(2deg);
  }

  39% {
    transform: rotate(-1deg);
  }

  41% {
    transform: rotate(1deg);
  }

  43% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(0);
  }
}
`}

&:hover {
  color: var(--main-color);
  transition: .3s;
}

svg {
  font-size: 24px;
}

${props => props.theme.mode === 'dark' &&
    css`
  color: var(--white-grey-1);
`}

@media (max-width: 430px) {
  padding: 0 .3rem;
}
`

export const NotificationBadge = styled.div<{ $primary?: boolean }>`
position: absolute;
background-color: var(--main-color);
color: var(--white-grey-1);
border-radius: 50%;
left: 12px;
bottom: 10px;
width: 25px;
height: 25px;
font-size: 12px;
font-weight: bold;
border: 2px solid var(--white-grey-1);
display: flex;
align-items: center;
justify-content: center;

span {
  max-width: 40px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

${props => props.$primary &&
    css`
    width: max-content;
    border-radius: 10px;
    padding: .5rem;
`}

${props => props.theme.mode === 'dark' &&
    css`
border-color: var(--main-last-color);
`
  }
`

export const Noticontainer = styled.div<{ $primary?: boolean, $readed?: boolean }>`
display: flex;
flex-direction: column;
border-bottom: 1px solid var(--grey-25);
padding: .5rem;
cursor: ${props => props.$readed ? 'pointer' : 'unset'};

${props => props.$primary &&
    css`
    background-color: var(--soft-grey);

    ${props => props.theme.mode === 'dark' &&
        css`
      background-color: var(--main-seccond-color);
`}
`}
`

export const NotiflexOne = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: space-between;
padding: 5px .5rem;

&>div {
  display: flex;
  align-items: center;
  gap: .7rem;

  &>div {
    display: none;
  }

  ${props => props.$primary && css`
  &>div {
    display: flex;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--main-color);
  }
    `}
}
`

export const NotiflexTwo = styled.div<{ $primary?: boolean }>`
padding: 5px .5rem;
`

export const CustomChart = styled.div`
width: 100%;
`

/* repair */
export const RepairContainer = styled.div<{ $primary?: boolean }>`

`

export const ManageRepairBody = styled.div<{ $primary?: boolean }>`
@media (max-width: 1185px) {
  display: grid;
  grid-template-columns: auto;
  gap: 1rem;
}

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

export const AddrepairBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 165px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: 0.5rem .8rem;

  &:hover {
    background-color: var(--second-color);
    transition: .3s;
  }

  ${props => props.$primary && css`
  padding: unset;
    width: 36px;
    height: 36px;
  `}

  svg {
    stroke-width: 1px;
  }
`

export const FormTitleFlex = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: .5rem;
margin-bottom: 1rem;

svg {
  font-size: 18px;
}
`

export const RepairHeader = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: space-between;

& h3 {
  margin-bottom: unset;
}
`

/* home adjust modal */
export const FilterHomeHOSWARD = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: 5px;
`

export const DeviceListFlex = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: right;
gap: .45rem;
`

export const ListBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 35px;
  max-height: 35px;
  border-radius: var(--border-radius-big);
  border: 2px solid var(--main-color);
  background-color: unset;
  color: var(--main-color);
  font-weight: bold;
  padding: 0.5rem;

  &:hover {
    background-color: var(--main-color);
    color: var(--white-grey-1);
    transition: .3s;
  }

  ${props => props.$primary &&
    css`
    background-color: var(--main-color);
    color: var(--white-grey-1);
  `}
`

export const DatatableHome = styled.div<{ $primary?: boolean }>`
@media (max-width: 1185px) {
  display: grid;
  grid-template-columns: auto;
  gap: 1rem;
}

&>div>div>div>div,&>div>div>div {
  background-color: transparent;
}

&>div>div>div>div>div,
&>div>nav {
  background-color: var(--bg-grey);
}

&>div>div>div>div:nth-child(2)>div:hover {
    outline: unset;
    color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--black)'};
    background-color: ${props => props.theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--white)'};
    transition: .3s;
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

export const RepairPrintBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem;

  svg {
    stroke-width: 1px;
  }

  &:hover {
    background-color: var(--second-color);
    transition: .3s;
  }
`

/* Repair Print Page */
export const PrintContainer = styled.div<{ $primary?: boolean }>`
  max-width: 1240px;
  max-height: 1754px;
  overflow: hidden;
`

export const PrintContent = styled.div<{ $primary?: boolean }>`
  box-sizing: border-box;
  padding: .5rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  color: black;

  ${props => props.theme.mode === 'dark' &&
    css`
background-color: var(--white-grey-1);
`}
`

export const PrintHeadPage = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: .5rem;
`

export const PrintHeadTitle = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  &>span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33%;
  gap: .5rem;
}

&>span:nth-child(2) {
  font-weight: bold;
  font-size: 24px;
}

&>span>span {
  color: var(--danger-color);
  font-size: 14px;
  font-weight: bold;
}
`

export const PrintHeadDescription = styled.div<{ $primary?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const PrintHeadDescriptionOne = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;

  &>span:nth-child(1) {
  font-size: 18px;
  font-weight: bold;
}

&>span:nth-child(2) {
  font-size: 14px;
}
`

export const OriginalPaper = styled.div<{ $primary?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 40px;
  letter-spacing: 1px;
  border: 1px solid black;
  font-weight: bold;
`

export const SectionSignature = styled.div<{ $primary?: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  border: 1px solid black;
`

export const SectionDetails = styled.div<{ $primary?: boolean }>`
&>div:nth-child(1) {
  display: flex;
  justify-content: space-between;
}

border: 1px solid black;
`

export const HDF1 = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: .5rem;
  width: 50%;
  max-width: 50%;
  font-size: 14px;
  gap: .5rem;
  overflow: hidden;

  ${props => props.$primary &&
    css`
  border-right: 1px solid black;
  `}

  &>span {
  display: flex;
  gap: .5rem;
}
`

export const TUD = styled.span<{ $class?: string }>`
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 5px;

  ${props => props.$class === 'preLine' &&
    css`
  width: 75%;
  white-space: pre-line;
  overflow-wrap: break-word;
`}

  ${props => props.$class === 't-n-w-1' &&
    css`
  width: 75%;
  white-space: pre-line;
  overflow-wrap: break-word;
  `}

  ${props => props.$class === 't-u-d-t-warp' &&
    css`
  max-width: 280px;
  display: inline-block;
  word-break: break-word;
`
  }
`

export const SectionWStatus = styled.div<{ $class?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 1rem .5rem 0 .5rem;
  font-size: 14px;
  border-top: 1px solid black;

  &>label {
  display: flex;
  align-items: center;
  gap: .5rem;
}

&>label>input {
  display: grid;
  place-content: center;
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 20px;
  height: 20px;
  border: 1px solid black;
  border-radius: unset;
}

&>label>input::before {
  content: "";
  width: 15px;
  height: 15px;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--main-color);
  transform-origin: bottom left;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

&>label>input:checked::before {
  transform: scale(1);
}
`

export const OtherDetails = styled.div<{ $primary?: boolean }>`
  box-sizing: border-box;
  border-bottom: 1px solid black;
  font-size: 14px;

  ${props => props.$primary && css`
  padding: 1rem .5rem;
  `}
`

export const FSF1 = styled.div<{ $t1?: string, $t2?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  padding: 1.5rem .5rem .5rem .5rem;
  box-sizing: border-box;

  ${props => props.$t1 === 'bd-1' &&
    css`
  border-right: 1px solid black;
`}

${props => props.$t2 === 's-f1' &&
    css`
  flex-direction: row;
  justify-content: space-between;
`}
`

export const SN1 = styled.div<{ $primary?: boolean }>`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const SSR = styled.span<{ $primary?: boolean }>`
  display: flex;
  justify-content: center;
  width: 100%;

  &>div {
  width: 80%;
}
`

export const SN2 = styled.span<{ $primary?: boolean }>`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const AttentionF = styled.div<{ $primary?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const AttentionP = styled.div<{ $primary?: boolean }>`
  color: var(--danger-color);

  &>span:nth-child(1) {
  font-weight: bold;
}

  &>span:nth-child(2) {
  font-size: 14px;
}
`

export const CDF1 = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: .5rem;
  font-size: 14px;
  box-sizing: border-box;
  border-bottom: 1px solid black;
`

export const CDF2 = styled.div<{ $primary?: boolean }>`
  display: flex;
  font-size: 14px;
  border-bottom: 1px solid black;
`

export const RR1 = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: .5rem;
  font-size: 14px;

  &>div:nth-child(1) {
  display: flex;
  align-items: start;
  gap: .5rem;
  padding: .5rem;
  box-sizing: border-box;
}

&>div:nth-child(1)>div:nth-child(1) {
  width: 20%;
}

&>div:nth-child(1)>div:nth-child(2) {
  width: 80%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: .5rem;
}

&>div:nth-child(2) {
  display: flex;
  justify-content: left;
  flex-direction: column;
  gap: .5rem;
  box-sizing: border-box;
  padding: .5rem;
}

&>div>div>span {
  display: flex;
  align-items: center;
  gap: .5rem;
}

&>div>div>span>input {
  display: grid;
  place-content: center;
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 20px;
  height: 20px;
  border: 1px solid black;
  border-radius: unset;
}

&>div>div>span>input::before {
  content: "";
  width: 15px;
  height: 15px;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--main-color);
  transform-origin: bottom left;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

&>div>div>span>input:checked::before {
  transform: scale(1);
}
`

export const Checkboxbsoveride = styled.div`
div>input:checked {
  background-color: var(--main-color);
  border-color: var(--main-color);
}
`

/* System setting */
export const SettingSystem = styled.div<{ $primary?: boolean }>`
@media (max-width: 430px) {
  &>ul>li:nth-child(2) {
    display: none;
  }
}
`

export const PasswordChangeFlex = styled.div<{ $primary: number }>`
margin-bottom: .5rem;
transition: .3s;

&>div {
  height: 5px;
  border-radius: 3px;

  ${props => props.$primary === 0 ?
    css`
      width: 0%;
      transition: .3s;
  `
    : props.$primary < 4 ?
      css`
      width: 25%;
      background-color: var(--grey);
      transition: .3s;
`:
      props.$primary < 8 ?
        css`
        width: 50%;
        background-color: var(--danger-color);
        transition: .3s;
`
        :

        props.$primary < 12 ?
          css`
          width: 75%;
          background-color: var(--warning-primary);
          transition: .3s;
`
          :
          css`
          width: 100%;
          background-color: var(--success-primary);
          transition: .3s;
`
  }
}
`

export const SwitchMode = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
`

export const ColorListFlex = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
align-items: center;
gap: .5rem;

span {
  font-size: 14px;
}
`

export const SettingSystemContainer = styled.div<{ $primary?: boolean }>`
display: flex;
/* flex-wrap: wrap; */
gap: 1rem;
height: 100%;
width: 100%;
margin-top: 1rem;
`

export const LineHeightSystem = styled.div<{ $primary?: boolean }>`
width: 1.3px;
height: auto;
border-radius: 1px;
background-color: rgba(150, 150, 150, .5);
`

export const H3mt = styled.h3`
margin-top: 1rem;
`

export const SettingLeftContainer = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
justify-content: space-between;
width: 180px;
height: calc(100dvh - 150px);
padding: .5rem;
transition: .3s;

&>div:nth-child(1) {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

${props => props.$primary &&
    css`
width: 200px;
transition: .3s;
`}

@media (max-width: 430px) {
  width: unset;
  height: calc(100dvh - 220px);
}
`

export const SubSideBottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const ListPrivacy = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .5rem .8rem;
  border-radius: var(--border-radius-big);
  cursor: pointer;

  &>span {
    font-size: 12px;
  }

  &:hover {
    opacity: .5;
    transition: .3s;
  }

  &>svg {
    display: none;
  }

  @media (max-width: 430px) {
    justify-content: center;

  &>svg {
    display: block;
    font-size: 24px;
  }

  &>span {
    display: none;
  }
}
`

export const ListMenu = styled.div<{ $primary?: boolean, $logout?: boolean }>`
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .5rem .8rem;
  border-radius: var(--border-radius-big);
  cursor: pointer;

  &:hover {
  background-color: var(--main-color);
  color: var(--white-grey-1);
  transition: .3s;
  }

  ${props => props.$primary &&
    css`
    background-color: var(--main-color);
    color: var(--white-grey-1);
  `}

span {
  font-size: 16px;
}

svg {
  font-size: 24px;
}

${props => props.$logout &&
    css`
  color: red;

  &:hover {
    background-color: var(--danger-color);
    color: var(--white-grey-1);
  }
`}

@media (max-width: 430px) {
  span {
    display: none;
  }
}
`

export const SettingRightContainer = styled.div<{ $primary?: boolean }>`
width: calc(100% - 250px);
padding: .5rem;

@media (max-width: 430px) {
  width: calc(100% - 90px);
}
`

export const ChooseColorsContainer = styled.div<{ $primary?: boolean }>`
max-height: calc(100dvh - 230px);
overflow: scroll;

&::-webkit-scrollbar {
    display: none;
  }
`

export const AccountContainer = styled.div<{ $primary?: boolean }>`
padding: 0 1rem 0 0;
max-height: calc(100dvh - 160px);
overflow-y: scroll;

&::-webkit-scrollbar {
  display: none;
}
`

export const ProfileFlexSetting = styled.div<{ $radius?: number, $dimension?: number, $imageFit?: boolean }>`
display: flex;
justify-content: space-between;
gap: 2rem;
margin: 1rem 0;

&>div:nth-child(1) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

&>div:nth-child(1)>div:nth-child(1) {
  display: block;
  position: relative;
  width: ${props => props.$dimension + 'px'};
  height: ${props => props.$dimension + 'px'};
  max-width: ${props => props.$dimension + 'px'};
  max-height: ${props => props.$dimension + 'px'};
  aspect-ratio: 150 / 150;
  overflow: hidden;
}

&>div:nth-child(1)>div:nth-child(1)>img {
  position: absolute;
  width: ${props => props.$dimension + 'px'};
  height: ${props => props.$dimension + 'px'};
  max-width: ${props => props.$dimension + 'px'};
  max-height: ${props => props.$dimension + 'px'};
  border-radius: ${porps => porps.$radius + '%'};
  background-color: var(--white-grey-1);
  object-fit: ${props => props.$imageFit ? 'cover' : 'contain'};
  aspect-ratio: 1/1;
  border: 3px solid var(--white-grey-1);
  overflow: hidden;
}

&>div:nth-child(1)>div:nth-child(1)>label {
  position: absolute;
  width: 35px;
  height: 35px;
  bottom: 5px;
  right: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main-color);
  border: 3px solid var(--white-grey-1);
  cursor: pointer;
  overflow: hidden;

  &>svg {
    font-size: 18px;
    color: var(--white-grey-1);
  }
}

&>div:nth-child(1)>div:nth-child(1)>label:hover {
  background-color: var(--second-color);
  transition: .3s;
}

&>div:nth-child(1)>div:nth-child(1)>label>input[type='file'] {
  display: none;
}

@media (max-width: 430px) {
  flex-direction: column;
  align-items: center;
  height: max-content;
  gap: 1.5rem;

  &>div:nth-child(1) {
    justify-content: center;
  }
}
`

export const EditProfileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 40px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem .8rem;

  &:hover {
    background-color: var(--second-color);
    transition: .3s;
  }
`

export const SecurityFlex = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
`

export const SecurityPasswordBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 40px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem .8rem;

  &:hover {
    background-color: var(--second-color);
    transition: .3s;
  }
`

export const FullscreenBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 40px;
  height: 40px;
  max-width: 40px;
  max-height: 40px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  padding: .3rem;

  &>svg {
    font-size: 20px;
    stroke-width: 1px;
  }

  &:hover {
    background-color: var(--second-color);
    transition: .3s;

    &>svg {
    font-size: 24px;
    }
  }
`

export const ColorPalette = styled.div<{ $primary?: boolean }>`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 1rem;
  margin: 1rem 0 0 .5rem;

  @media (max-width: 1185px) {
    grid-template-columns: repeat(5, 1fr);
}

  @media (max-width: 430px) {
    grid-template-columns: repeat(3, 1fr);
}
`

const getColorStyles = ($color?: string) => {
  switch ($color) {
    case 'palette1':
      return css`
        border: 2px solid #2A2AE7;
        background-color: #2A2AE7;

        svg {
          background-color: #2323B7;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(35, 35, 183, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette2':
      return css`
        border: 2px solid #2ECC71;
        background-color: #2ECC71;

        svg {
          background-color: #21874C;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(46, 204, 113, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette3':
      return css`
        border: 2px solid #68D2E8;
        background-color: #68D2E8;

        svg {
          background-color: #03AED2;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(3, 174, 210, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette4':
      return css`
        border: 2px solid #FFC700;
        background-color: #FFC700;

        svg {
          background-color: #C99E00;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(201, 158, 0, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette5':
      return css`
        border: 2px solid #A569BD;
        background-color: #A569BD;

        svg {
          background-color: #734A84;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(165, 105, 189, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette6':
      return css`
        border: 2px solid #E48D55;
        background-color: #E48D55;

        svg {
          background-color: #D67536;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(214, 117, 54, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette7':
      return css`
        border: 2px solid #3C4E7F;
        background-color: #3C4E7F;

        svg {
          background-color: #26355D;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(38, 53, 93, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette8':
      return css`
        border: 2px solid #EE4545;
        background-color: #EE4545;

        svg {
          background-color: #DF3737;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(223, 55, 55, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette9':
      return css`
        border: 2px solid #53C1AB;
        background-color: #53C1AB;

        svg {
          background-color: #3FA28E;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(63, 162, 142, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette10':
      return css`
        border: 2px solid #9A9B94;
        background-color: #9A9B94;

        svg {
          background-color: #888983;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(136, 137, 131, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette11':
      return css`
        border: 2px solid #8DC6FF;
        background-color: #8DC6FF;

        svg {
          background-color: #70AAE4;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(112, 170, 228, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette12':
      return css`
        border: 2px solid #D65F00;
        background-color: #D65F00;

        svg {
          background-color: #C04D00;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(192, 77, 0, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette13':
      return css`
        border: 2px solid #06D001;
        background-color: #06D001;

        svg {
          background-color: #059212;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(5, 146, 18, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette14':
      return css`
        border: 2px solid #745C97;
        background-color: #745C97;

        svg {
          background-color: #39375B;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(57, 55, 91, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette15':
      return css`
        border: 2px solid #000000;
        background-color: #000000;

        svg {
          background-color: #212121;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(33, 33, 33, .3);
          transition: box-shadow ease .25s;
        }
      `
    case 'palette16':
      return css`
        border: 2px solid #93786A;
        background-color: #93786A;

        svg {
          background-color: #7A5947;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(122, 89, 71, .3);
          transition: box-shadow ease .25s;
        }
      `
    default:
      return css`
        border: 2px solid #F57B7C;
        background-color: #F57B7C;

        svg {
          background-color: #EA6B6C;
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 0.25rem rgba(234, 107, 108, .3);
          transition: box-shadow ease .25s;
        }
      `
  }
}

export const ButtonColorChang = styled.button<{ $color?: string }>`
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-big);

  @media (max-width: 430px) {
    width: 50px;
    height: 50px;
    border-radius: var(--border-radius-big);
  }

  svg {
    font-size: 42px;
    border-radius: 50%;
    color: var(--white-grey-1);

    @media (max-width: 430px) {
      font-size: 32px;
    }
  }

  ${props => getColorStyles(props.$color)}
`

/* warranty */
export const WarrantyHead = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 1rem;

  &>div:nth-child(1) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: .5rem;
  }

  @media (max-width: 430px) {
    flex-direction: column;
    align-items: unset;
    gap: 1rem;

  &>div:nth-child(2) {
    display: flex;
    justify-content: end;
  }
}
`

export const WarrantyHeadBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 35px;
  border-radius: var(--border-radius-big);
  border: 2px solid ${props => props.theme.mode === 'dark' ? 'var(--soft-grey)' : 'var(--grey-75)'};
  background-color: unset;
  color: ${props => props.theme.mode === 'dark' ? 'var(--soft-grey)' : 'var(--grey-75)'};
  font-weight: bold;
  padding: .5rem .7rem;

  &:hover {
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
    color: var(--white-grey-1);
    transition: .3s;
  }

  ${props => props.$primary &&
    css`
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
    color: var(--white-grey-1);
  `}
`

export const WarrantyBody = styled.div<{ $primary?: boolean }>`
&>div>div>div>div,&>div>div>div {
  background-color: transparent;
}

  margin-top: 1rem;
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

export const DetailFlex = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .5rem;
`

export const DetailWarranty = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 165px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: 0.5rem;

  svg {
    stroke-width: 1px;
  }

  &:hover {
    background-color: var(--second-color);
    transition: .3s;

    svg {
      color: var(--white-grey-1);
      transition: .3s;
    }
  }
`

/* warranty print */
export const WCD1 = styled.div<{ $primary?: boolean }>`
  background-image: url(../../assets/images/Thanes.png);
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${props => props.theme.mode === 'dark' &&
    css`
    color: black;
`}
`

export const WCDC1 = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid black;

  &>div:nth-child(1)>div:nth-child(1)>img {
  height: 100px;
  position: relative;
  left: 35px;
  top: 25px;
}
  &>div:nth-child(1) {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

&>div:nth-child(1)>div {
  width: 50%;
}

&>div:nth-child(1)>div:nth-child(1) {
  display: flex;
  align-items: center;
  justify-content: left;
  padding: .5rem;
  box-sizing: border-box;
  font-size: 24px;
}

&>div:nth-child(1)>div:nth-child(2) {
  display: flex;
  flex-direction: column;
  align-items: end;
  padding: .5rem;
  box-sizing: border-box;
}

&>div:nth-child(2) {
  display: flex;
  width: 100%;
}

&>div:nth-child(2)>div {
  width: 33.33%;
  padding: .5rem;
  box-sizing: border-box;
}

&>div:nth-child(2)>div:nth-child(1) {
  font-size: 18px;
  font-weight: bold;
}

&>div:nth-child(2)>div:nth-child(2) {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: 14px;
}

&>div:nth-child(2)>div:nth-child(2)>div {
  display: flex;
  flex-direction: column;
  align-items: end;
}

&>div:nth-child(2)>div:nth-child(3) {
  display: flex;
  gap: .5rem;
  font-size: 14px;
}

&>div:nth-child(2)>div:nth-child(3)>div {
  display: flex;
  flex-direction: column;
  align-items: end;
}

&>div:nth-child(3) {
  display: flex;
  width: 100%;
  padding: .5rem;
  box-sizing: border-box;
}

&>div:nth-child(3)>div {
  width: 50%;
}

&>div:nth-child(3)>div>div {
  display: flex;
  gap: .5rem;
  width: 100%;
  font-size: 14px;
  margin-bottom: .5rem;
}

&>div:nth-child(3)>div>div>span {
  width: 50%;
}

&>div:nth-child(3)>div>div>span:nth-child(1) {
  display: flex;
  flex-direction: column;
  align-items: end;
  font-weight: bold;
}

&>div:nth-child(4) {
  box-sizing: border-box;
  padding: .5rem;
  font-size: 14px;
  width: 100%;
}

&>div:nth-child(4)>div {
  display: flex;
  margin-left: 8rem;
  gap: .5rem;
  margin-bottom: .5rem;
}

&>div:nth-child(4)>div>div:nth-child(1) {
  display: flex;
  flex-direction: column;
  align-items: end;
  font-weight: bold;
}

&>div:nth-child(4)>div:nth-child(2)>span {
  font-weight: bold;
  display: flex;
  justify-content: right;
}
`

export const WCDC2 = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid black;
  padding: 1rem .5rem;
  box-sizing: border-box;

  &>div:nth-child(1) {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
}

&>div:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  font-size: 14px;
  padding: 0 3rem;
  box-sizing: border-box;
}

&>div:nth-child(2)>div {
  display: flex;
  gap: .5rem;
}

&>div:nth-child(2)>div:nth-child(5) {
  display: flex;
  flex-direction: column;
  margin-left: 2.5rem;
}

&>div:nth-child(3) {
  display: flex;
  width: 100%;
  font-size: 14px;
}

&>div:nth-child(3)>div:nth-child(1) {
  width: 20%;
}

&>div:nth-child(3)>div:nth-child(1)>img {
  width: 130px;
  transform: translateY(20px);
}

&>div:nth-child(3)>div:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  width: 80%;
}
`

/* contact */
export const ContactContainer = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: center;
align-items: center;
height: calc(100dvh - 80px);
gap: 7rem;

@media (max-width: 1185px) {
  display: grid;
  grid-template-columns: auto;
  margin: 1rem 0;
}

@media (max-width: 430px) {
  display: grid;
  grid-template-columns: auto;
  gap: unset;
}
`

export const ContactFlexOne = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;

@media (max-width: 430px) {
  width: 100%;
  justify-content: center;
}
`

export const ContactInfo = styled.div<{ $primary?: boolean }>`
display: flex;
flex-direction: column;
gap: 1rem;

&>div>label>div:nth-child(2) {
  display: flex;
  align-items: center;
  gap: .5rem;
}

h2 {
  margin-bottom: 1rem;
}

p {
  width: 300px;
}
`

export const ContactIfram = styled.div<{ $primary?: boolean }>`
@media (max-width: 430px) {
  width: 100%;
}

iframe {
  width: 720px;
  height: 480px;
  border-radius: var(--border-radius-big);
}

@media (max-width: 430px) {
  width: unset;

  iframe {
  width: 348px;
  height: 280px;
}
}
`

export const SubWardColumnFlex = styled.div<{ $primary?: boolean }>`
&>div>div>div>div, &>div>div>div {
  background-color: transparent;
}

&>div>div>div>div>div,
&>div>nav {
  background-color: var(--bg-grey);
  padding-left: 5rem;
}

&>div>div>div>div>div, &>div>div>div {
  background-color: var(--main-black-tb);
}

${props => props.theme.mode === 'dark' &&
    css`
    &>div>div>div>div:nth-child(2)>div {
    border-bottom: 1px solid rgba(255, 255, 255, .1);
  }

&>div>div>div>div>div,
&>div>nav {
  background-color: var(--main-dark-color);
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

export const TableInfoDevice = styled.div<{ $primary?: boolean }>`
display: none;
flex-direction: column;
gap: .5rem;
padding: .5rem;
width: 1080px;
height: max-content;

&>h4 {
display: flex;
justify-content: center;
align-items: center;
width: 100%;
font-weight: bold;
}

&>span {
display: flex;
justify-content: center;
align-items: center;
width: 100%;
}
`

export const TabConnect = styled.div<{ $primary?: boolean, $show?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  background-color: ${props => props.$primary ? 'var(--danger-color)' : 'var(--main-color)'};
  opacity: ${props => props.$show ? 1 : 0};
  z-index: 999999;
  transition: ease-in .3s;

  &>span{
    color: var(--white-grey-1);
    font-size: 16px;
    line-height: 2rem;
    font-weight: bold;
    padding: 4px 0px;
  }

  @media (max-width: 430px) {
    bottom: 75px;
  }
`

export const ProfileFlex = styled.div<{ $radius?: number, $dimension?: number, $imageFit?: boolean }>`
display: flex;
gap: 2rem;
margin: 1rem 0;
justify-content: center;

&>div {
  display: block;
  position: relative;
  width: ${props => props.$dimension + 'px'};
  height: ${props => props.$dimension + 'px'};
  max-width: ${props => props.$dimension + 'px'};
  max-height: ${props => props.$dimension + 'px'};
  aspect-ratio: 150 / 150;
  overflow: hidden;
}

&>div>img {
  position: absolute;
  width: ${props => props.$dimension + 'px'};
  height: ${props => props.$dimension + 'px'};
  max-width: ${props => props.$dimension + 'px'};
  max-height: ${props => props.$dimension + 'px'};
  border-radius: ${porps => porps.$radius + '%'};
  background-color: var(--white-grey-1);
  object-fit: ${props => props.$imageFit ? 'cover' : 'contain'};
  aspect-ratio: 1/1;
  border: 3px solid var(--white-grey-1);
  overflow: hidden;
}

&>div>label {
  position: absolute;
  width: 35px;
  height: 35px;
  bottom: 5px;
  right: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main-color);
  border: 3px solid var(--white-grey-1);
  cursor: pointer;
  overflow: hidden;

  &>svg {
    font-size: 18px;
    color: var(--white-grey-1);
  }
}

&>div>label:hover {
  background-color: var(--second-color);
  transition: .3s;
}

&>div>label>input[type='file'] {
  display: none;
}

@media (max-width: 430px) {
  flex-direction: column;
  align-items: center;
  height: 275px;
  gap: 1.5rem;

  &>div:nth-child(2) {
    height: 100px;
  }
}
`