import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import LangguageSelector from '../../components/lang/LangguageSelector'
import Swal from "sweetalert2"
import axios, { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { FormEvent, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { RiLoader3Line } from "react-icons/ri"
// import { FaLine } from "react-icons/fa"
import { useEffect } from 'react'
import { setCookieEncode } from '../../stores/utilsStateSlice'
import { useDispatch } from 'react-redux'
import { storeDispatchType } from '../../stores/store'
import { responseType } from '../../types/response.type'
import { LoginResponse } from '../../types/response.type'
import { accessToken, cookieOptions, cookies } from '../../constants/constants'
import {
  CardContainer, CardFlex, HeaderText, LangContainer, LoadingButton,
  LoginButton,
  LoginContact,
  TimeStap
} from '../../style/components/login'
import { LineHr } from '../../style/style'
import { Helmet } from 'react-helmet'
import { AgreeSection } from '../../style/components/contact.styled'

export default function Login() {
  const dispatch = useDispatch<storeDispatchType>()
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [loginform, setLoginform] = useState({
    username: '',
    password: ''
  })
  const [isloading, setIsloading] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const changeFavicon = (href: string) => {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/jpg'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
      document.title = `${location.pathname.split("/")[1] !== '' ? location.pathname.split("/")[1] : 'home'}`
    }

    changeFavicon('Logo_SM_WBG.jpg')

    return () => {
      changeFavicon('Logo_SM_WBG.jpg')
    }
  }, [location])

  const submitForm = async (e: FormEvent) => {
    e.preventDefault()
    if (loginform.username !== '' && loginform.password !== '') {
      try {
        setIsloading(true)
        const url: string = `${import.meta.env.VITE_APP_API}/auth/login`
        const data = {
          username: loginform.username,
          password: loginform.password,
        }
        const response = await axios.post<responseType<LoginResponse>>(url, data)
        const { displayName, hosId, hosName, hosPic, token, userId, userLevel, userPic, wardId } = response.data.data
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
        navigate(`/`)
      } catch (error) {
        if (error instanceof AxiosError) {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
          setIsloading(false)
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: 'Uknown Error',
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
          setIsloading(false)
        }
      }
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000) // อัปเดตทุก 1 นาที

    // ล้าง interval เมื่อ component ถูก unmounted
    return () => clearInterval(intervalId)
  }, [])

  const formattedDate = currentDate.toLocaleDateString(t('thTime'), {
    weekday: 'long', // 'long' สำหรับแสดงชื่อวันแบบเต็ม
    year: 'numeric',
    month: 'long', // 'long' สำหรับแสดงชื่อเดือนแบบเต็ม
    day: 'numeric',
  })
  const formattedTime = currentDate.toLocaleTimeString(t('thTime'), {
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit'
  })

  return (
    <Container className='p-3'>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <LangContainer>
        <LangguageSelector />
      </LangContainer>
      <CardContainer>
        <CardFlex>
          <div>
            <HeaderText>SMTrack+</HeaderText>
            <span>Real-time temperature monitoring with alerts for exceeding limits</span>
          </div>
          {/* <h3 className="mb-3 text-center">{t('loginHeader')}</h3> */}
          <Form onSubmit={submitForm} id='form-login' className='mt-4'>
            <InputGroup className="mb-3">
              <FloatingLabel
                controlId="floatingInputUsername"
                label={t('loginUsername')}
                className="mb-2"
              >
                <Form.Control
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="user-input"
                  className='login-form-input'
                  autoComplete='off'
                  autoFocus
                  type='text'
                  value={loginform.username}
                  onChange={(e) => setLoginform({ ...loginform, username: e.target.value })}
                />
              </FloatingLabel>
            </InputGroup>
            <InputGroup className="mb-3">
              <FloatingLabel
                controlId="floatingInputPassword"
                label={t('loginPassword')}
                className="mb-2"
              >
                <Form.Control
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="user-input"
                  autoComplete='off'
                  type='password'
                  value={loginform.password}
                  onChange={(e) => setLoginform({ ...loginform, password: e.target.value })}
                />
              </FloatingLabel>
            </InputGroup>
            <LoginButton
              $primary={isloading}
              disabled={isloading}
              type="submit"
            >{isloading ? <LoadingButton>
              <RiLoader3Line />
              {t('loginButtonLoading')}</LoadingButton> : t('loginButton')}
            </LoginButton>
            <LoginContact>
              <LineHr />
              <span className=''>{t('contactUs')}</span>
              <LineHr />
            </LoginContact>
            <AgreeSection>
              <span>{t('neddHelp')} <Link to={'/support'}>{t('contactSupport')}</Link></span>
            </AgreeSection>
          </Form>
        </CardFlex>
        <TimeStap>
          <span>{`${formattedDate} ${formattedTime}`}</span>
        </TimeStap>
      </CardContainer>
    </Container>
  )
}
