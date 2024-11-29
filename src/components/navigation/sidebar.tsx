import {
  RiDashboardFill, RiDashboardLine,
  RiFileSettingsFill, RiFileSettingsLine, RiHome3Fill, RiHome3Line,
  RiListSettingsFill, RiListSettingsLine, RiSettings3Fill, RiSettings3Line, RiShieldCheckFill,
  RiShieldCheckLine, RiUser6Fill, RiUser6Line
} from "react-icons/ri"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  HospitalName, Li, LineHr,
  MainMenuSide,
  SettingSystem,
  Sidebar, SidebarLogo, SpanAside, ToggleTmsButtonWrapper, TooltipSpan, Ul
} from '../../style/style'
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCookieEncode, setShowAlert, setShowAside, setSwitchTms } from "../../stores/utilsStateSlice"
import { RootState, storeDispatchType } from "../../stores/store"
import { AboutVersion } from "../../style/components/sidebar"
import { responseType } from "../../types/response.type"
import axios, { AxiosError } from "axios"
import { usersType } from "../../types/user.type"
import { accessToken, cookieOptions, cookies, ImageComponent } from "../../constants/constants"

export default function sidebar() {
  const dispatch = useDispatch<storeDispatchType>()
  const { expand, tokenDecode, cookieDecode, notiData, isTms } = useSelector((state: RootState) => state.utilsState)
  const { token, hosImg, hosName, userLevel } = cookieDecode
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  let isFirstLoad = true

  const reFetchdata = async () => {
    if (tokenDecode.userId) {
      try {
        const response = await axios
          .get<responseType<usersType>>(`${import.meta.env.VITE_APP_API}/user/${tokenDecode.userId}`, { headers: { authorization: `Bearer ${token}` } })
        const { displayName, userId, userLevel, userPic, ward, wardId } = response.data.data
        const { hosId, hospital } = ward
        const { hosPic, hosName } = hospital
        const localDataObject = {
          userId: userId,
          hosId: hosId,
          displayName: displayName,
          userPicture: userPic,
          userLevel: userLevel,
          hosImg: hosPic,
          hosName: hosName,
          groupId: wardId,
          token: token
        }
        cookies.set('localDataObject', String(accessToken(localDataObject)), cookieOptions)
        dispatch(setCookieEncode(String(accessToken(localDataObject))))
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setShowAlert(true))
          } else {
            console.error('Something wrong' + error)
          }
        } else {
          console.error('Uknown error: ', error)
        }
      }
    }
  }

  useEffect(() => {
    if (!token) return
    if (location.pathname !== '/login') {
      window.scrollTo(0, 0)

      if (isFirstLoad) {
        reFetchdata()
        isFirstLoad = false
        return
      }

      const timer = setTimeout(() => {
        reFetchdata()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [location, token, tokenDecode])

  useEffect(() => {
    const changeFavicon = (href: string) => {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/png'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link);
      document.title =
        (notiData.filter((n) => n.notiStatus === false).length > 0
          ? `(${notiData.filter((n) => n.notiStatus === false).length}) `
          : '') +
        hosName +
        ' - ' +
        `${location.pathname.split('/')[1] !== '' ? location.pathname.split('/')[1] : 'home'}`
    }

    const addNotificationDotToFavicon = async () => {
      const baseImageSrc = hosImg
        ? `${import.meta.env.VITE_APP_IMG}${hosImg}`
        : 'Logo_SM_WBG.jpg'

      const img = new Image()
      img.src = baseImageSrc
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) return

        const size = 64;
        canvas.width = size
        canvas.height = size

        ctx.drawImage(img, 0, 0, size, size)

        const dotSize = 24
        const x = size - dotSize + 10
        const y = dotSize / 5 + 10
        ctx.fillStyle = 'red'
        ctx.beginPath()
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2)
        ctx.fill()

        changeFavicon(canvas.toDataURL('image/png'))
      }
    }

    if (notiData.filter((n) => n.notiStatus === false).length > 0) {
      addNotificationDotToFavicon()
    } else {
      if (hosImg) {
        changeFavicon(`${import.meta.env.VITE_APP_IMG}${hosImg}`)
      }
    }

    return () => {
      changeFavicon('Logo_SM_WBG.jpg');
    }
  }, [location, cookieDecode, hosImg, notiData])

  const resetAsideandCardcount = () => {
    dispatch(setShowAside(false))
  }

  return (
    <Sidebar $primary={expand}>
      <Link to="/" onClick={resetAsideandCardcount} className="d-flex flex-column align-items-center mb-3 mb-md-0 link-dark text-decoration-none">
        <SidebarLogo
          $primary={expand}
        >
          <ImageComponent src={hosImg ? `${import.meta.env.VITE_APP_IMG}${hosImg}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="hos-logo" />
        </SidebarLogo>
        <HospitalName $primary={expand}>{hosName}</HospitalName>
      </Link>
      <LineHr $primary />
      <Ul $primary={expand} $maxheight className="nav nav-pills">
        <MainMenuSide>
          <Li $primary={expand}>
            <Link to="/" onClick={resetAsideandCardcount} className={location.pathname === "/" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"} aria-current="page">
              {
                location.pathname === "/" ?
                  <RiHome3Fill />
                  :
                  <RiHome3Line />
              }
              <SpanAside $primary={expand}>
                {t('sideShowAllBox')}
              </SpanAside>
            </Link>
            <TooltipSpan $primary={expand}>
              {t('sideShowAllBox')}
            </TooltipSpan>
          </Li>
          <Li $primary={expand}>
            <Link to="/dashboard" onClick={resetAsideandCardcount} className={location.pathname === "/dashboard" || location.pathname.split('/')[2] === "chart" || location.pathname.split('/')[2] === "table" || location.pathname === "/dashboard/chart/compare" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
              {
                location.pathname === "/dashboard" || location.pathname.split('/')[2] === "chart" || location.pathname.split('/')[2] === "table" || location.pathname === "/dashboard/chart/compare" ?
                  <RiDashboardFill />
                  :
                  <RiDashboardLine />
              }
              <SpanAside $primary={expand}>
                {t('sideDashboard')}
              </SpanAside>
            </Link>
            <TooltipSpan $primary={expand}>
              {t('sideDashboard')}
            </TooltipSpan>
          </Li>
          {
            userLevel !== '3' ?
              <>
                <Li $primary={expand}>
                  <Link to="/permission" onClick={resetAsideandCardcount} className={location.pathname === "/permission" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
                    {
                      location.pathname === "/permission" ?
                        <RiUser6Fill />
                        :
                        <RiUser6Line />
                    }
                    <SpanAside $primary={expand}>
                      {t('sidePermission')}
                    </SpanAside>
                  </Link>
                  <TooltipSpan $primary={expand}>
                    {t('sidePermission')}
                  </TooltipSpan>
                </Li>
                <Li $primary={expand}>
                  <Link to="/management" onClick={resetAsideandCardcount} className={location.pathname === "/management" || location.pathname === "/management/logadjust" || location.pathname === "/management/flasher" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
                    {
                      location.pathname === "/management" || location.pathname === "/management/logadjust" || location.pathname === '/management/flasher' ?
                        <RiListSettingsFill />
                        :
                        <RiListSettingsLine />
                    }
                    <SpanAside $primary={expand}>
                      {t('sideManage')}
                    </SpanAside>
                  </Link>
                  <TooltipSpan $primary={expand}>
                    {t('sideManage')}
                  </TooltipSpan>
                </Li> </>
              :
              <></>
          }
        </MainMenuSide>
        <LineHr />
        <Li $primary={expand}>
          <Link to="/warranty" onClick={resetAsideandCardcount} className={location.pathname === "/warranty" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
            {
              location.pathname === "/warranty" ?
                <RiShieldCheckFill />
                :
                <RiShieldCheckLine />
            }
            <SpanAside $primary={expand}>
              {t('sideWarranty')}
            </SpanAside>
          </Link>
          <TooltipSpan $primary={expand}>
            {t('sideWarranty')}
          </TooltipSpan>
        </Li>
        <Li $primary={expand}>
          <Link to="/repair" onClick={resetAsideandCardcount} className={location.pathname === "/repair" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
            {
              location.pathname === "/repair" ?
                <RiFileSettingsFill />
                :
                <RiFileSettingsLine />
            }
            <SpanAside $primary={expand}>
              {t('sideRepair')}
            </SpanAside>
          </Link>
          <TooltipSpan $primary={expand}>
            {t('sideRepair')}
          </TooltipSpan>
        </Li>
      </Ul>
      <LineHr />
      <SettingSystem>
        <Ul className="nav nav-pills">
          {
            userLevel === "0" && !expand && <span>{t('switchModeMain')}</span>
          }
          {
            userLevel === "0" && <Li>
              <ToggleTmsButtonWrapper onClick={() => { navigate("/"); dispatch(setSwitchTms(!isTms)); cookies.set('isTms', !isTms, cookieOptions); }} $primary={isTms}>
                <div className="icon">
                  {isTms ? 'TMS' : 'E/I'}
                </div>
              </ToggleTmsButtonWrapper>
            </Li>
          }
          <Li $primary={expand}>
            <Link to="/settings" onClick={resetAsideandCardcount} className={location.pathname === "/settings" ? "nav-link d-flex align-items-center gap-2  active" : "nav-link d-flex align-items-center gap-2 text-dark"}>
              {
                location.pathname === "/settings" ?
                  <RiSettings3Fill />
                  :
                  <RiSettings3Line />
              }
              <SpanAside $primary={expand}>
                {t('sideSetting')}
              </SpanAside>
            </Link>
            <TooltipSpan $primary={expand}>
              {t('sideSetting')}
            </TooltipSpan>
          </Li>
        </Ul>
      </SettingSystem>
      <AboutVersion $primary={expand} $click onClick={() => { navigate('/changeLog'); resetAsideandCardcount() }}>{import.meta.env.VITE_APP_VERSION}</AboutVersion>
      {/* <AboutVersion $primary={expand} $click={import.meta.env.VITE_APP_NODE_ENV === 'development'} onClick={() => { import.meta.env.VITE_APP_NODE_ENV === 'development' ? navigate('/changeLog') : null; resetAsideandCardcount() }}>{import.meta.env.VITE_APP_VERSION}</AboutVersion> */}
    </Sidebar>
  )
}
