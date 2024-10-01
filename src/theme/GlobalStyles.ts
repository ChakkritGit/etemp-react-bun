// GlobalStyles.ts
import { createGlobalStyle, css } from 'styled-components'

const GlobalStyles = createGlobalStyle`
body {
  background-color: var(--bg-grey);
}

.react-select__control:hover {
  border-color: var(--main-color) !important;
}

.form-control {
  border-radius: var(--border-radius-small);
}

.form-control:disabled {
  cursor: not-allowed;
  opacity: .5;
}

/* Scroll bar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: unset;
}

::-webkit-scrollbar-thumb {
  background: var(--main-color);
  border-radius: 7px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--second-color);
}

/* bootstrap navlink */
.nav-tabs .nav-link {
  color: var(--black);
  border-top-left-radius: var(--border-radius-big) !important;
  border-top-right-radius: var(--border-radius-big) !important;
}

.nav-tabs .nav-link.active {
  color: var(--main-color) !important;
  border-bottom: 2.5px solid var(--main-color) !important;
}

.nav-tabs .nav-link:hover {
  color: var(--main-color);
}

/* bootstrap offcanvas */
.offcanvas {
  background-color: var(--white-grey-1) !important;
}

/* sweetalert */
div:where(.swal2-container) div:where(.swal2-actions) {
  gap: 0.5rem;

  & .btn.btn-danger,
  & .btn.btn-dark {
    display: flex !important;
    justify-content: center;
    align-items: center;
    width: max-content;
  }

  & .btn.btn-warning {
    background-color: var(--warning-primary);
    border-color: var(--warning-primary);
    color: var(--white-grey-1);
  }

  & .btn.btn-warning:hover {
    background-color: var(--warning-seccond);
    border-color: var(--warning-seccond);
    color: var(--white-grey-1);
  }

  & .btn.btn-warning:focus {
    outline: none;
    border-color: var(--warning-primary);
  }
}

div:where(.swal2-container).swal2-center>.swal2-popup {
  border-radius: var(--border-radius-big);
}

div:where(.swal2-container).swal2-backdrop-show {
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

body.swal2-toast-shown .swal2-container {
  backdrop-filter: unset;
  -webkit-backdrop-filter: unset;
}

div:where(.swal2-icon).swal2-warning {
  border-color: var(--warning-primary) !important;
  color: var(--warning-primary) !important;
}

div:where(.swal2-icon).swal2-error {
  border-color: var(--danger-primary) !important;
}

div:where(.swal2-icon).swal2-error [class^="swal2-x-mark-line"] {
  background-color: var(--danger-primary) !important;
}

div:where(.swal2-icon).swal2-success {
  border-color: var(--success-primary) !important;
}

div:where(.swal2-icon).swal2-success [class^="swal2-success-line"] {
  background-color: var(--success-primary) !important;
}

div:where(.swal2-icon).swal2-success .swal2-success-ring {
  border-color: rgba(128, 231, 79, 0.3) !important;
}

/*  */

.modal-backdrop.show {
  opacity: 1 !important;
}

.modal-backdrop {
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.4) !important;
}

.dropdown>button::after {
  display: none;
}

.offcanvas,
.offcanvas-header {
  width: 235px !important;
  overflow: hidden;
}

.dropdown-menu {
  border-radius: var(--border-radius-big) !important;
}

.nav-pills .nav-link {
  border-radius: var(--border-radius-big) !important;
  height: 48px;
}

.modal-content {
  border-radius: var(--border-radius-big) !important;
  border: unset !important;
}

input[type="range"]::-webkit-slider-thumb {
  background: var(--main-color) !important;
  scale: 1.25;
}

input[type="range"]::-moz-range-thumb {
  background: var(--main-color) !important;
  scale: 1.25;
}

.modal-header {
  padding: 0.8rem !important;
}

.compare-text {
  color: black;
}

ol>li>a {
  color: var(--grey);
  text-decoration: unset;
}

ol>li>a:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
  color: var(--main-color);
  transition: 0.3s;
}

.css-1gqyz35-MuiTypography-root {
  color: black !important;
}

/* slider range */
.css-14pt78w-MuiSlider-rail,
.css-1gv0vcd-MuiSlider-track {
  height: 7px !important;
}

/* up/down off */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.form-check-input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

/* wait system colors */
input:focus,
textarea:focus,
select:focus {
  box-shadow: 0 0 0 0.25rem var(--main-color-opacity2) !important;
  border-color: var(--main-color) !important;
}

.apexcharts-tooltip {
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
  color: black;
}

.apexcharts-menu {
  background-color: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
  color: black;
  border-color: transparent !important;
}

.apexcharts-menu-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.apexcharts-theme-light .apexcharts-menu-item:hover {
  background-color: var(--main-color) !important;
  color: white !important;
}

.apexcharts-menu,
.apexcharts-menu-item {
  border-radius: 8px !important;
}

.apexcharts-canvas .apexcharts-reset-zoom-icon.apexcharts-selected svg,
.apexcharts-canvas .apexcharts-selection-icon.apexcharts-selected svg,
.apexcharts-canvas .apexcharts-zoom-icon.apexcharts-selected svg {
  fill: var(--main-color) !important;
}

.apexcharts-reset-icon:hover,
.apexcharts-menu-icon:hover,
.apexcharts-zoomout-icon:hover,
.apexcharts-zoomin-icon:hover {
  svg {
    fill: var(--main-color) !important;
  }
}

.MuiBreadcrumbs-li {
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-check {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
}

.form-check-input {
  width: 24px !important;
  height: 24px !important;
}

.form-check-input:checked {
  background-color: var(--main-color) !important;
  border-color: var(--main-color) !important;
  transition: 0.3s !important;
}

.form-check-input:hover {
  border-color: var(--main-color) !important;
  transition: 0.3s;
}

.swal2-popup.swal2-toast {
  background-color: rgba(255, 255, 255, .4) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

img {
  text-align: center;
  color: var(--main-seccond-color);
  object-fit: contain;
  aspect-ratio: 1 / 1;
}

.xterm {
  cursor: text;
  position: relative;
  user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
}

.xterm.focus,
.xterm:focus {
  outline: none;
}

.xterm .xterm-helpers {
  position: absolute;
  top: 0;
  z-index: 5;
}

.xterm .xterm-helper-textarea {
  padding: 0;
  border: 0;
  margin: 0;
  /* Move textarea out of the screen to the far left, so that the cursor is not visible */
  position: absolute;
  opacity: 0;
  left: -9999em;
  top: 0;
  width: 0;
  height: 0;
  z-index: -5;
  /** Prevent wrapping so the IME appears against the textarea at the correct position */
  white-space: nowrap;
  overflow: hidden;
  resize: none;
}

.xterm .composition-view {
  /* TODO: Composition position got messed up somewhere */
  background: #000;
  color: #FFF;
  display: none;
  position: absolute;
  white-space: nowrap;
  z-index: 1;
}

.xterm .composition-view.active {
  display: block;
}

.xterm .xterm-viewport {
  /* On OS X this is required in order for the scroll bar to appear fully opaque */
  background-color: #000;
  overflow-y: scroll;
  cursor: default;
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
}

.xterm .xterm-screen {
  position: relative;
}

.xterm .xterm-screen canvas {
  position: absolute;
  left: 0;
  top: 0;
}

.xterm .xterm-scroll-area {
  visibility: hidden;
}

.xterm-char-measure-element {
  display: inline-block;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: -9999em;
  line-height: normal;
}

.xterm.enable-mouse-events {
  /* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
  cursor: default;
}

.xterm.xterm-cursor-pointer,
.xterm .xterm-cursor-pointer {
  cursor: pointer;
}

.xterm.column-select.focus {
  /* Column selection mode */
  cursor: crosshair;
}

.xterm .xterm-accessibility,
.xterm .xterm-message {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  color: transparent;
}

.xterm .live-region {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.xterm-dim {
  opacity: 0.5;
}

.xterm-underline {
  text-decoration: underline;
}

.xterm-strikethrough {
  text-decoration: line-through;
}

.xterm-screen .xterm-decoration-container .xterm-decoration {
  z-index: 6;
  position: absolute;
}

.xterm-decoration-overview-ruler {
  z-index: 7;
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
}

.xterm-decoration-top {
  z-index: 2;
  position: relative;
}

.react-select__control {
  border: var(--bs-border-width) solid var(--bs-border-color) !important;
}

.home-lg {
  max-width: 1450px;
}

#nprogress .bar {
  background: linear-gradient(90deg, var(--main-color-opacity1) 0%, var(--second-color) 70%, var(--main-color) 100%);
}

#nprogress .peg {
  box-shadow: 0 0 10px var(--main-color), 0 0 5px var(--main-color);
}

.Link-bread-cmui {
  color: var(--grey) !important;
  text-decoration: unset !important;
  cursor: pointer;
}

.Link-bread-cmui:hover {
  color: var(--main-color) !important;
  transition: .3s;
}

.react-select--is-disabled {
  opacity: .5;

  &>div {
    background-color: var(--soft-grey);
  }
}

${(props) =>
    props.theme.mode === 'dark' ?
      css`
body {
  background-color: var(--main-seccond-color);
}

.react-select--is-disabled {
  opacity: .3;

  &>div {
    background-color: var(--main-seccond-color);
  }
}

.login-card,
.modal-content {
  background-color: var(--main-last-color);
  color: var(--white-grey-1);
}

.form-control {
  background-color: var(--main-last-color);
  border-color: var(--border-dark-color);
  color: var(--white-grey-1);
}

.form-control:focus {
  background-color: var(--main-last-color);
  color: var(--white-grey-1);
}

.form-control:disabled {
  background-color: var(--main-seccond-color);
  border-color: var(--main-seccond-color);
  opacity: .5;
}

.form-floating>.form-control:focus~label {
  color: var(--grey);
}

.form-floating>.form-control:focus~label::after {
  background-color: var(--main-last-color);
}

.form-floating>.form-control:not(:placeholder-shown)~label {
  color: var(--grey);
}

.form-floating>.form-control:not(:placeholder-shown)~label::after {
  background-color: unset;
}

.modal-header {
  border-bottom: var(--bs-modal-header-border-width) solid var(--border-dark-color);
}

.modal-footer {
  border-top: var(--bs-modal-footer-border-width) solid var(--border-dark-color);
}

.sidebar-dark-bg {
  background-color: var(--main-last-color);
  border-color: var(--border-dark-color);

  .nav-link,
  .sidebar-dark-text {
    color: var(--white-grey-1) !important;
  }
}

.outlet-dark-bg {
  background-color: var(--main-seccond-color) !important;
  color: var(--white-grey-1);
}

.lang-switcher-dark {
  color: var(--white-grey-1);
}

.dropdown-menu {
  background-color: var(--main-last-color);
  border-color: var(--border-dark-color);

  & a {
    color: var(--white-grey-1);
  }
}

.dropdown-item:focus,
.dropdown-item:hover {
  background-color: var(--main-seccond-color);
  color: var(--white-grey-1);
}

.dropdown-item.disabled,
.dropdown-item:disabled {
  color: var(--soft-grey);
}

hr {
  color: var(--grey);
}

.profile-name-dark {
  color: var(--white-grey-1);
}

div:where(.swal2-container).swal2-center>.swal2-popup {
  background-color: var(--main-last-color);
  color: var(--white-grey-1);
}

.nav-tabs {
  border-bottom-color: var(--border-dark-color);
}

.nav-tabs .nav-link {
  color: var(--grey);
}

.nav-tabs .nav-link.active {
  background-color: var(--main-last-color);
  border-color: var(--border-dark-color);
  color: var(--white-grey-1) !important;
}

.nav-tabs .nav-link:hover {
  color: var(--white-grey-1);
  border-color: var(--border-dark-color);
}

.container>nav>ol>li:nth-child(2),
.container>nav>ol>li:nth-child(3)>p,
.container>nav>ol>li:nth-child(4) {
  color: var(--grey) !important;
}

.offcanvas {
  background-color: var(--main-last-color) !important;
}

.go2072408551 {
  background-color: var(--main-last-color);
  color: var(--white-grey-1);
}

.apexcharts-tooltip {
  background-color: rgba(100, 100, 100, 0.5);
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
  color: white;
}

.apexcharts-text tspan  {
  fill: white;
}

.apexcharts-legend-text {
  color: white !important;
}

.apexcharts-menu-icon, .apexcharts-pan-icon, .apexcharts-reset-icon, .apexcharts-selection-icon, .apexcharts-toolbar-custom-icon, .apexcharts-zoom-icon, .apexcharts-zoomin-icon, .apexcharts-zoomout-icon {
  color: white !important;

  svg {
    fill: white !important;
  }
}

.apexcharts-menu {
  background-color: rgba(100, 100, 100, 0.5) !important;
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
  color: white;
  border-color: transparent !important;
}

.apexcharts-gridline {
  stroke: var(--border-dark-color);
}

.form-select {
  background-color: var(--main-last-color);
  border-color: var(--border-dark-color);
  border-width: 1.5px;
  color: var(--white-grey-1);
}

.swal2-popup.swal2-toast {
  background-color: var(--main-last-rgba) !important;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  color: white;
}

.form-select:disabled {
  background-color: var(--main-seccond-color);
}

.compare-text {
  color: white;
}

.react-select__menu {
  color: white !important;
  background-color: var(--main-last-color) !important;
}

.react-select__input-container, .react-select__single-value {
  color: white !important;
}

.react-select__control {
  border-color: var(--border-dark-color) !important;
}

.react-select__control:hover {
  border-color: var(--main-color) !important;
}

.MuiBreadcrumbs-ol {
  color: white;

  &>li>p {
    color: white !important;
}
}
`
      :
      `
      `
  }`

export default GlobalStyles