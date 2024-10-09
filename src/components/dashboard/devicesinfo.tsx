import {
  RiBatteryChargeLine,
  RiCloseLine, RiCollageLine, RiCpuLine, RiDoorClosedLine, RiFolderSettingsLine,
  RiPlugLine, RiSdCardMiniLine, RiSettings3Line, RiShieldCheckLine,
  RiSignalWifi1Line, RiTempColdLine
} from "react-icons/ri"
import {
  CardDevBtn,
  DashboardDevicesDetails, DashboardDevicesInfo,
  DeviceDetailsBody, DeviceDetailsBodyInfo, DeviceDetailsBodyimg,
  DeviceDetailsHead, DevicesBodyStatus, ExpandPicture, FormBtn,
  FormFlexBtn, ModalHead, SpanCardDash, TooltipSpanLeft
} from "../../style/style"
import { devicesType } from "../../types/device.type"
import { CardstatusNomal, CardstatusSpecial } from "./cardstatus"
import { FormEvent, useEffect, useState } from "react"
import { Form, Modal, Row } from "react-bootstrap"
import axios, { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import { client } from "../../services/mqtt"
import { responseType } from "../../types/response.type"
import { probeType } from "../../types/probe.type"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { setRefetchdata, setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import { fetchDevicesLog } from "../../stores/LogsSlice"
import Adjustment from "../adjustments/adjustment"

type devicesinfo = {
  devicesData: devicesType,
  index: number
}

type dateCalType = {
  daysRemaining: number,
  years: number,
  months: number,
  remainingDays: number
}

export default function Devicesinfo(devicesinfo: devicesinfo) {
  const { devicesData } = devicesinfo
  const dispatch = useDispatch<storeDispatchType>()
  const { t } = useTranslation()
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [show, setShow] = useState(false)
  const [showPic, setShowpic] = useState(false)
  const { probe } = devicesData
  const [formdata, setFormdata] = useState({
    adjustTemp: probe[0]?.adjustTemp,
    adjustHum: probe[0]?.adjustHum
  })
  const [tempvalue, setTempvalue] = useState<number[]>([probe[0]?.tempMin, probe[0]?.tempMax])
  const [humvalue, setHumvalue] = useState<number[]>([probe[0]?.humMin, probe[0]?.humMax])
  const [mqttData, setMqttData] = useState({ temp: 0, humi: 0 })
  const [dataData, setDateData] = useState<dateCalType>({} as dateCalType)

  const handleTempChange = (_event: Event, newValue: number | number[]) => {
    setTempvalue(newValue as number[])
  }
  const handleHumChange = (_event: Event, newValue: number | number[]) => {
    setHumvalue(newValue as number[])
  }

  const handleAdjusttempChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjustTemp: newValue as number })
  }

  const handleAdjusthumChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjustHum: newValue as number })
  }

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    const deviceModel = devicesData.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
    if (deviceModel === 'eTEMP') {
      client.publish(`siamatic/etemp/v1/${devicesData.devSerial}/temp`, 'off')
    } else {
      client.publish(`siamatic/items/v3/${devicesData.devSerial}/temp`, 'off')
    }
    client.publish(`${devicesData.devSerial}/temp`, 'off')
    setShow(false)
  }

  const openPicmodal = () => {
    setShowpic(true)
  }

  const closePicmodal = () => {
    setShowpic(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/probe/${devicesData?.probe[0]?.probeId}`
    try {
      const response = await axios.put<responseType<probeType>>(url, {
        tempMin: tempvalue[0],
        tempMax: tempvalue[1],
        humMin: humvalue[0],
        humMax: humvalue[1],
        adjustTemp: formdata.adjustTemp,
        adjustHum: formdata.adjustHum,
      }, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      setShow(false)
      dispatch(fetchDevicesLog({ deviceId: devicesData.devId, token: token }))
      dispatch(setRefetchdata(true))
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      } else {
        Swal.fire({
          title: t('alertHeaderError'),
          text: 'Uknown Error',
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    }
  }

  useEffect(() => {
    if (show) {
      client.subscribe(`${devicesData.devSerial}/temp/real`, (err) => {
        if (err) {
          console.error("MQTT Suubscribe Error", err)
        }
      })

      const deviceModel = devicesData.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
      if (deviceModel === 'eTEMP') {
        client.publish(`siamatic/etemp/v1/${devicesData.devSerial}/temp`, 'on')
      } else {
        client.publish(`siamatic/items/v3/${devicesData.devSerial}/temp`, 'on')
      }
      client.publish(`${devicesData.devSerial}/temp`, 'on')

      client.on('message', (_topic, message) => {
        setMqttData(JSON.parse(message.toString()))
      })

      client.on("error", (err) => {
        console.error("MQTT Error: ", err)
        client.end()
      })

      client.on("reconnect", () => {
        console.error("MQTT Reconnecting...")
      })
    }
  }, [show])

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }

  const calulateDate = (devicesData: devicesType) => {
    const { warranty } = devicesData
    const today = new Date()
    const expiredDate = new Date(String(warranty[0]?.expire))
    // Use the expiredDate directly
    const timeDifference = expiredDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

    let remainingDays = daysRemaining
    let years = 0
    let months = 0

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    while (remainingDays >= 365) {
      if (isLeapYear(today.getFullYear() + years)) {
        if (remainingDays >= 366) {
          remainingDays -= 366
          years++
        } else {
          break
        }
      } else {
        remainingDays -= 365
        years++
      }
    }

    let currentMonth = today.getMonth()
    while (remainingDays >= daysInMonth[currentMonth]) {
      if (currentMonth === 1 && isLeapYear(today.getFullYear() + years)) {
        if (remainingDays >= 29) {
          remainingDays -= 29
          months++
        } else {
          break
        }
      } else {
        remainingDays -= daysInMonth[currentMonth]
        months++
      }
      currentMonth = (currentMonth + 1) % 12
    }

    return {
      daysRemaining,
      years,
      months,
      remainingDays
    }
  }

  useEffect(() => {
    setDateData(calulateDate(devicesData))
  }, [devicesData])

  useEffect(() => {
    if (show) {
      setFormdata({
        adjustTemp: probe[0]?.adjustTemp,
        adjustHum: probe[0]?.adjustHum
      })
      setTempvalue([probe[0]?.tempMin, probe[0]?.tempMax])
      setHumvalue([probe[0]?.humMin, probe[0]?.humMax])
    }
  }, [show])

  return (
    <DashboardDevicesInfo>
      <DashboardDevicesDetails>
        <DeviceDetailsHead>
          <div>
            <SpanCardDash>
              <b>{t('deviceNameBox')}</b>
              <span>•</span>
              <span>{devicesData?.devDetail}</span>
            </SpanCardDash>
            <SpanCardDash>
              <b>{t('deviceSnBox')}</b>
              <span>•</span>
              <span>{devicesData?.devSerial}</span>
            </SpanCardDash>
          </div>
          <CardDevBtn onClick={openmodal}>
            <RiSettings3Line />
            <TooltipSpanLeft>
              {t('deviceToolAdjust')}
            </TooltipSpanLeft>
          </CardDevBtn>
        </DeviceDetailsHead>
        <DeviceDetailsBody>
          <DeviceDetailsBodyimg
            onClick={openPicmodal}
            src={devicesData?.locPic ? `${import.meta.env.VITE_APP_IMG}${devicesData?.locPic}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`}
            alt="device_pic"
            loading="lazy" />
          <DeviceDetailsBodyInfo>
            <div>
              <li><b title={devicesData?.locInstall ? devicesData?.locInstall : '- -'}>{devicesData?.locInstall ? devicesData?.locInstall : '- -'}</b></li>
              <li><b>{t('tempValueUnit')}</b>: {probe[0]?.tempMin} - {probe[0]?.tempMax} °C</li>
              <li><b>{t('humValueUnit')}</b>: {probe[0]?.humMin} - {probe[0]?.humMax} %RH</li>
              <li><b>{t('ipAddress')}</b>: {devicesData?.config?.ip ? devicesData?.config?.ip : '- -'}</li>
              <li><b>{t('macAddress')}</b>: {devicesData?.config?.macAddWiFi ? devicesData?.config?.macAddWiFi : '- -'}</li>
              <li><b>{t('firmWareVer')}</b>: {devicesData?.firmwareVersion ? devicesData?.firmwareVersion : '- -'}</li>
            </div>
          </DeviceDetailsBodyInfo>
        </DeviceDetailsBody>
      </DashboardDevicesDetails>
      <DevicesBodyStatus>
        <CardstatusSpecial
          title={t('dashProbe')}
          svg={<RiCpuLine />}
          valuesone={`Temp: ${devicesData?.log[0]?.tempAvg ? devicesData?.log[0]?.tempAvg.toFixed(2) : '- -'}`}
          valuestwo={`Hum: ${devicesData?.log[0]?.humidityAvg ? devicesData?.log[0]?.humidityAvg.toFixed(2) : '- -'}`}
          pipeone={'°C'}
          pipetwo={'%RH'}
          alertone={Number(devicesData?.log[0]?.tempAvg.toFixed(2)) === 0 || Number(devicesData?.log[0]?.tempAvg.toFixed(2)) >= probe[0]?.tempMax || Number(devicesData?.log[0]?.tempAvg.toFixed(2)) <= probe[0]?.tempMin}
          alerttwo={Number(devicesData?.log[0]?.humidityAvg.toFixed(2)) === 0 || Number(devicesData?.log[0]?.humidityAvg.toFixed(2)) >= probe[0]?.humMax || Number(Number(devicesData?.log[0]?.humidityAvg.toFixed(2))) <= probe[0]?.humMin}
        />
        <CardstatusNomal
          title={t('dashConnect')}
          valuestext={
            devicesData.backupStatus === '0' ? t('stateDisconnect') : t('stateConnect')}
          svg={<RiSignalWifi1Line />}
          alertone={devicesData.backupStatus === '0'}
        />
        <CardstatusNomal
          title={t('dashDoor')}
          valuestext={
            !devicesData?.log[0]?.door1 ||
              !devicesData?.log[0]?.door2 ||
              !devicesData?.log[0]?.door3 ? t('stateOn') : t('stateOff')}
          svg={<RiDoorClosedLine />}
          alertone={
            !devicesData?.log[0]?.door1 ||
            !devicesData?.log[0]?.door2 ||
            !devicesData?.log[0]?.door3
          }
        />
        <CardstatusNomal
          title={t('dashPlug')}
          valuestext={
            devicesData?.log[0]?.ac !== '1' ? t('stateNormal') : t('stateProblem')
          }
          svg={<RiPlugLine />}
          alertone={devicesData?.log[0]?.ac === '1'}
        />
        <CardstatusNomal
          title={t('dashBattery')}
          valuestext={
            `${devicesData?.log[0]?.battery ? devicesData?.log[0]?.battery : '- -'} %`
          }
          svg={<RiBatteryChargeLine />}
          alertone={devicesData?.log[0]?.battery === 0 || devicesData?.log[0]?.battery === undefined}
        />
        <CardstatusSpecial
          title={t('dashTempofDay')}
          svg={<RiTempColdLine />}
          valuesone={`↑ ${devicesData?.log.length > 0 ? Number(Math.max(...(devicesData?.log.map((items) => items.tempAvg)))).toFixed(2) : '- -'}`}
          valuestwo={`↓ ${devicesData?.log.length > 0 ? Number(Math.min(...(devicesData?.log.map((items) => items.tempAvg)))).toFixed(2) : '- -'}`}
          pipeone={'°C'}
          pipetwo={'°C'}
        />
        <CardstatusNomal
          title={t('dashSdCard')}
          valuestext={
            devicesData?.log[0]?.sdCard === '0' ? t('stateNormal') : t('stateProblem')
          }
          svg={<RiSdCardMiniLine />}
          alertone={devicesData?.log[0]?.sdCard !== '0'}
        />
        <CardstatusSpecial
          title={t('dashProbeandDoor')}
          svg={<RiCollageLine />}
          valuesone={`${devicesData?.probe.length} P.`}
          valuestwo={`${devicesData?.probe[0]?.door} D.`}
          pipetwo={''}
        />
        <CardstatusNomal
          title={t('dashWarranty')}
          svg={<RiShieldCheckLine />}
          valuestext={
            dataData.daysRemaining > 0
              ? dataData.years > 0
                ? `${dataData.years} ${t('year')} ${dataData.months} ${t('month')} ${dataData.remainingDays} ${t('day')}`
                : dataData.months > 0
                  ? `${dataData.months} ${t('month')} ${dataData.remainingDays} ${t('day')}`
                  : `${dataData.remainingDays} ${t('day')}`
              : t('tabWarrantyExpired')
          }
          alertone={Math.ceil((new Date(devicesData.dateInstall ?? devicesData?.dateInstall).setFullYear(new Date(devicesData ? devicesData?.dateInstall : '2024-01-01').getFullYear() + 1) - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 0}
          pathName="/warranty"
        />
        <CardstatusNomal
          title={t('dashRepair')}
          valuestext={
            '- -'
          }
          svg={<RiFolderSettingsLine />}
          pathName="/repair"
        />
      </DevicesBodyStatus>

      <Modal size="lg" show={show} onHide={closemodal}>
        <Modal.Header>
          {/* <pre style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(formdata)}
          </pre> */}
          <ModalHead>
            <strong>
              {devicesData?.devSerial}
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Adjustment
                devicesdata={devicesData}
                formData={formdata}
                handleAdjusthumChange={handleAdjusthumChange}
                handleAdjusttempChange={handleAdjusttempChange}
                handleHumChange={handleHumChange}
                handleTempChange={handleTempChange}
                humvalue={humvalue}
                mqttData={mqttData}
                setFormData={setFormdata}
                setHumvalue={setHumvalue}
                setTempvalue={setTempvalue}
                tempvalue={tempvalue}
              />
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('saveButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal size="xl" show={showPic} onHide={closePicmodal}>
        <Modal.Header>
          {/* <pre style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(formdata)}
          </pre> */}
          <ModalHead>
            <strong>
              {devicesData?.devSerial}
            </strong>
            <button onClick={closePicmodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <ExpandPicture>
              <img
                src={devicesData?.locPic ? `${import.meta.env.VITE_APP_IMG}${devicesData?.locPic}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`}
                alt="device_pic" />
            </ExpandPicture>
          </Modal.Body>
        </Form>
      </Modal>
    </DashboardDevicesInfo>
  )
}
