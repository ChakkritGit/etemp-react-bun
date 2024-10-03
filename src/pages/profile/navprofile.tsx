import { RiArrowDropDownLine, RiLogoutBoxRLine } from "react-icons/ri"
import { LineHr, NavLogout, NavProfile, NavProfileContainer, NavProfileFlex } from "../../style/style"
import { Dropdown } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavbarProfileDropdown } from "../../style/components/navbar"
import { cookieOptions, cookies } from "../../constants/constants"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { storeDispatchType } from "../../stores/store"
import { swalWithBootstrapButtons } from "../../components/dropdown/sweetalertLib"
import { reset } from "../../stores/resetAction"
import { setCookieEncode, setDeviceId, setSerial } from "../../stores/utilsStateSlice"

export default function Navprofile() {
  const navigate = useNavigate()
  const dispatch = useDispatch<storeDispatchType>()
  const { t } = useTranslation()
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { userPicture, displayName, userLevel } = cookieDecode

  const logOut = () => {
    dispatch(reset())
    dispatch(setCookieEncode(''))
    dispatch(setDeviceId(''))
    dispatch(setSerial(''))
    cookies.remove('localDataObject', cookieOptions)
    cookies.remove('devSerial', cookieOptions)
    cookies.remove('devid', cookieOptions)
    cookies.remove('selectHos', cookieOptions)
    cookies.remove('selectWard', cookieOptions)
    cookies.update()
    navigate("/login")
  }

  return (
    <Dropdown>
      <Dropdown.Toggle variant="0" className="border-0 p-0">
        <NavProfileFlex>
          <NavProfileContainer className="profile-name-dark">
            <NavProfile src={userPicture ? `${import.meta.env.VITE_APP_IMG}${userPicture}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="profile" />
            <div>
              <span>{displayName}</span>
              <span>{userLevel === '0' ? t('levelSuper') : userLevel === '1' ? t('levelService') : userLevel === '2' ? t('levelAdmin') : t('levelUser')}</span>
            </div>
            <RiArrowDropDownLine size={28} />
          </NavProfileContainer>
        </NavProfileFlex>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <NavbarProfileDropdown>
          <NavProfileContainer onClick={() => navigate("/settings")}>
            <NavProfile src={userPicture ? `${import.meta.env.VITE_APP_IMG}${userPicture}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="profile" />
            <div style={{ display: 'flex', flexDirection: 'column', width: '100px', maxWidth: '100px' }}>
              <span style={{ display: 'block', width: '100px', maxWidth: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{displayName}</span>
              <strong style={{ width: '100px', maxWidth: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{userLevel === "0" ? t('levelSuper') : userLevel === "1" ? t('levelService') : userLevel === "2" ? t('levelAdmin') : t('levelUser')}</strong>
            </div>
          </NavProfileContainer>
          <LineHr />
          <NavLogout onClick={() => swalWithBootstrapButtons
            .fire({
              title: t('logoutDialog'),
              text: t('logoutDialogText'),
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: t('confirmButton'),
              cancelButtonText: t('cancelButton'),
              reverseButtons: false,
            })
            .then((result) => {
              if (result.isConfirmed) {
                logOut()
              }
            })}>
            <RiLogoutBoxRLine />
            {t('tabLogout')}
          </NavLogout>
        </NavbarProfileDropdown>
      </Dropdown.Menu>
    </Dropdown>
  )
}
