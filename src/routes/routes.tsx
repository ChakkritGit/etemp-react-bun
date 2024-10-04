import { HideFlashFW, Hidesetting, Islogout } from '../authen/authen'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { socket } from '../services/websocket'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { storeDispatchType } from '../stores/store'
import { setCookieDecode, setSocketData } from '../stores/utilsStateSlice'
import { client } from '../services/mqtt'
import { socketResponseType } from '../types/component.type'
import { TabConnect } from '../style/style'
import { useTranslation } from 'react-i18next'
import { DeviceStateStore, UtilsStateStore } from '../types/redux.type'
import { AuthRoute } from '../middleware/authprotect'
import { CookieType } from '../types/cookie.type'
import toast, { useToasterStore } from 'react-hot-toast'
import ErrorPage from '../routes/error-page'
import Home from '../pages/home/home'
import Dashboard from '../pages/dashboard/dashboard'
import Main from "../../src/main/main"
import Setting from '../pages/setting/setting'
import Permission from '../pages/users/manageusers'
import Warranty from '../pages/warranty/warranty'
import Repair from '../pages/repair/repair'
// import Contact from '../pages/contact/contact'
import Fullchart from '../pages/dashboard/fullchart'
import Fulltable from '../pages/dashboard/fulltable'
import System from '../pages/system/system'
import Comparechart from '../pages/dashboard/compare.chart'
import Log from '../pages/log/log'
import ESPToolComponent from '../pages/setting/devices/serial.port'
import CryptoJS from "crypto-js"
import { decodeCookieObject } from '../constants/constants'
import SomethingWrong from './something-wrong'
import { fetchDevicesData } from '../stores/devicesSlices'
import { fetchHospitals, fetchWards, filtersDevices } from '../stores/dataArraySlices'
import { fetchUserData } from '../stores/userSlice'
import { fetchDevicesLog } from '../stores/LogsSlice'
import { fetchProbeData } from '../stores/probeSlice'
// import Logs from '../pages/setting/Logs'
import PreviewPDF from '../components/pdf/preview.pdf'
import Policy from '../pages/policy/policy'
// import Test from '../pages/test/test'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRoute />,
    children: [
      {
        path: "/",
        element: <Main />,
        errorElement: <SomethingWrong />,
        children: [
          {
            path: "/",
            element: <Home />,
            errorElement: <SomethingWrong />
          },
          {
            path: "dashboard",
            element: <Dashboard />,
            errorElement: <SomethingWrong />
          },
          {
            element: <Hidesetting />,
            errorElement: <SomethingWrong />,
            children: [
              {
                path: "permission",
                element: <Permission />,
                errorElement: <SomethingWrong />
              },
              {
                path: "management",
                element: <Setting />,
                errorElement: <SomethingWrong />
              },
              {
                path: "management/:id",
                element: <Setting />,
                errorElement: <SomethingWrong />
              },
              // {
              //   path: 'logs',
              //   element: <Logs />,
              //   errorElement: <SomethingWrong />
              // }
            ],
          },
          {
            path: "warranty",
            element: <Warranty />,
            errorElement: <SomethingWrong />
          },
          {
            path: "repair",
            element: <Repair />,
            errorElement: <SomethingWrong />
          },
          // {
          //   path: "contact",
          //   element: <Contact />,
          //   errorElement: <SomethingWrong />
          // },
          {
            path: "settings",
            element: <System />,
            errorElement: <SomethingWrong />
          },
          {
            path: "dashboard/chart",
            element: <Fullchart />,
            errorElement: <SomethingWrong />
          },
          {
            path: "dashboard/chart/preview",
            element: <PreviewPDF />,
            errorElement: <SomethingWrong />
          },
          {
            path: "dashboard/table",
            element: <Fulltable />,
            errorElement: <SomethingWrong />
          },
          {
            path: "dashboard/chart/compare",
            element: <Comparechart />,
            errorElement: <SomethingWrong />
          },
          {
            path: "changeLog",
            element: <Log />,
            errorElement: <SomethingWrong />
          },
          // {
          //   path: "test",
          //   element: <Test />,
          //   errorElement: <SomethingWrong />
          // },
          {
            element: <HideFlashFW />,
            errorElement: <SomethingWrong />,
            children: [
              {
                path: "management/flasher",
                element: <ESPToolComponent />,
                errorElement: <SomethingWrong />
              },
            ]
          }
        ],
      }
    ],
  },
  {
    path: "/privacy-policy",
    element: <Policy />,
    errorElement: <SomethingWrong />
  },
  {
    path: "/login",
    element: <Islogout />,
    errorElement: <SomethingWrong />
  },
  {
    path: "*",
    element: <ErrorPage />,
    errorElement: <SomethingWrong />
  },
])

export default function RoutesComponent() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const [status, setStatus] = useState(false)
  const [show, setShow] = useState(false)
  const { cookieEncode, cookieDecode, tokenDecode, deviceId } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const { userLevel, hosId } = tokenDecode
  const { toasts } = useToasterStore()
  const toastLimit = 5

  const handleConnect = () => { }
  const handleDisconnect = (reason: any) => console.error("Disconnected from Socket server:", reason)
  const handleError = (error: any) => console.error("Socket error:", error)
  const handleMessage = (response: socketResponseType) => {
    if (!userLevel && !hosId) return

    if (userLevel === "0" || userLevel === "1" || hosId === response.hospital) {
      dispatch(setSocketData(response))
    }
  }

  useEffect(() => {
    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("error", handleError)
    socket.on("receive_message", handleMessage)
    // socket.on("device_event", handleDeviceEvent)

    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("error", handleError)
      socket.off("receive_message", handleMessage)
      // socket.off("device_event", handleDeviceEvent)
    }
  }, [userLevel, hosId])

  useEffect(() => {
    try {
      client.on('connect', () => { setStatus(false); setTimeout(() => { setShow(false) }, 3000) })
      client.on('disconnect', () => { setStatus(true); setShow(true) })
    } catch (error) {
      console.error("MQTT Error: ", error)
    }
  }, [])

  useEffect(() => {
    toasts
      .filter((toasts) => toasts.visible)
      .filter((_, index) => index >= toastLimit)
      .forEach((toasts) => toast.dismiss(toasts.id))
  }, [toasts])

  useEffect(() => {
    if (!cookieEncode) return
    try {
      const CookieObject: CookieType = JSON.parse(decodeCookieObject(cookieEncode).toString(CryptoJS.enc.Utf8))
      dispatch(setCookieDecode(CookieObject))
    } catch (error) {
      console.error('Decoded error: ', error)
    }
  }, [cookieEncode])

  useEffect(() => {
    const handleOffline = () => { setStatus(true); setShow(true) }
    const handleOnline = () => {
      setStatus(false)
      setTimeout(() => { setShow(false) }, 3000)
      if (!token) return
      if (deviceId !== "undefined") dispatch(fetchDevicesLog({ deviceId, token }))
      dispatch(fetchDevicesData(token))
      dispatch(filtersDevices(token))
      dispatch(fetchHospitals(token))
      dispatch(fetchWards(token))
      dispatch(fetchUserData(token))
      dispatch(fetchProbeData(token))
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [token, deviceId])

  return (
    <>
      <RouterProvider
        router={router}
        future={{ v7_startTransition: true }}
      />
      {show && <TabConnect $primary={status} $show={show}>
        <span>{status ? t('stateDisconnect') : t('stateConnect')}</span>
      </TabConnect>}
    </>
  )
}