import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import {
  FormBtn, FormFlexBtn, FormSliderRange, LineHr, ModalHead, RangeInputText,
  SliderFlex, SliderLabelFlex, SliderRangeFlex
} from "../../style/style"
import {
  RiAlarmWarningFill, RiArrowDownLine, RiArrowLeftSLine, RiArrowRightLine,
  RiBellFill,
  RiCloseLine
} from "react-icons/ri"
import {
  AdjustRealTimeFlex, ModalMuteHead, MuteFlex, NotiActionFlex,
  OpenSettingBuzzer, ScheduleFlec, ScheduleItem, ScheduleItemFlex,
  ToggleButtonAllDays
} from "../../style/components/home.styled"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { AsyncThunk } from "@reduxjs/toolkit"
import { devicesType } from "../../types/device.type"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { responseType } from "../../types/response.type"
import { client } from "../../services/mqtt"
import { configType, Option, Schedule, ScheduleHour, ScheduleMinute, Ward } from "../../types/config.type"
import { ConfigBtn } from "../../style/components/manage.config"
import { MuteEtemp } from "../../style/components/sound.setting"
import { storeDispatchType } from "../../stores/store"
import { setRefetchdata, setShowAlert } from "../../stores/utilsStateSlice"
import { useTheme } from "../../theme/ThemeProvider"
import { cookieOptions, cookies, scheduleDayArray, scheduleMinuteArray, scheduleTimeArray } from "../../constants/constants"
import { Slider } from "@mui/material"
import axios, { AxiosError } from "axios"
import Select, { SingleValue } from 'react-select'
import Swal from "sweetalert2"

type modalAdjustType = {
  fetchData: AsyncThunk<devicesType[], string, {}>,
  devicesdata: devicesType,
  setShow: Dispatch<SetStateAction<boolean>>,
  show: boolean
}

const ModalAdjust = (modalProps: modalAdjustType) => {
  const { fetchData, devicesdata, show, setShow } = modalProps
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { tokenDecode, cookieDecode, reFetchData } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [tempvalue, setTempvalue] = useState<number[]>([Number(devicesdata.probe[0]?.tempMin), Number(devicesdata.probe[0]?.tempMax)])
  const [humvalue, setHumvalue] = useState<number[]>([Number(devicesdata.probe[0]?.humMin), Number(devicesdata.probe[0]?.humMax)])
  const [showSetting, setShowSetting] = useState(false)
  const [showSettingMute, setShowSettingMute] = useState(false)
  const [formData, setFormData] = useState({
    adjustTemp: devicesdata.probe[0]?.adjustTemp,
    adjustHum: devicesdata.probe[0]?.adjustHum
  })
  const [muteMode, setMuteMode] = useState({
    choichOne: devicesdata.config.notiTime === 0 ? 'immediately' : 'after',
    choichtwo: devicesdata.config.backToNormal === "0" ? 'send' : 'donotsend',
    choichthree: devicesdata.config.repeat === 0 ? "onetime" : 'every',
    choichfour: devicesdata.config.mobileNoti === "0" ? 'on' : 'off'
  })
  const [sendTime, setSendTime] = useState({
    after: devicesdata.config.notiTime > 0 ? devicesdata.config.notiTime : 5,
    every: devicesdata.config.repeat !== 0 ? devicesdata.config.repeat : 5
  })
  const [mqttData, setMqttData] = useState({ temp: 0, humi: 0 })
  const [selectProbeI, setSelectProbeI] = useState(devicesdata.probe[0]?.probeId)
  const [muteEtemp, setMuteEtemp] = useState({
    temporary: false,
    always: cookies.get(devicesdata.devSerial) === 'always' || false,
    door: cookies.get(devicesdata.devSerial) === 'door' || false,
  })
  const [scheduleDay, setScheduleDay] = useState({
    firstDay: devicesdata.config.firstDay ?? null,
    seccondDay: devicesdata.config.secondDay ?? null,
    thirdDay: devicesdata.config.thirdDay ?? null
  })
  const [scheduleTime, setScheduleTime] = useState({
    firstTime: devicesdata.config.firstTime?.substring(0, 2) ?? null,
    secondTime: devicesdata.config.secondTime?.substring(0, 2) ?? null,
    thirdTime: devicesdata.config.thirdTime?.substring(0, 2) ?? null,
    firstMinute: devicesdata.config.firstTime?.substring(2, 4) ?? null,
    seccondMinute: devicesdata.config.secondTime?.substring(2, 4) ?? null,
    thirdMinute: devicesdata.config.thirdTime?.substring(2, 4) ?? null
  })
  const { choichOne, choichfour, choichthree, choichtwo } = muteMode
  const { userLevel } = tokenDecode
  const { theme } = useTheme()

  const handleTempChange = (_event: Event, newValue: number | number[]) => {
    setTempvalue(newValue as number[])
  }
  const handleHumChange = (_event: Event, newValue: number | number[]) => {
    setHumvalue(newValue as number[])
  }

  const handleAdjusttempChange = (_event: Event, newValue: number | number[]) => {
    setFormData({ ...formData, adjustTemp: newValue as number })
  }

  const handleAdjusthumChange = (_event: Event, newValue: number | number[]) => {
    setFormData({ ...formData, adjustHum: newValue as number })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const url: string = `${import.meta.env.VITE_APP_API}/probe/${selectProbeI}`
      const bodyData = {
        tempMin: tempvalue[0],
        tempMax: tempvalue[1],
        humMin: humvalue[0],
        humMax: humvalue[1],
        adjustTemp: formData.adjustTemp,
        adjustHum: formData.adjustHum,
      }

      if (Number((mqttData.humi + formData.adjustHum - devicesdata.probe[0]?.adjustHum).toFixed(2)) > 100.00 || Number((mqttData.humi + formData.adjustHum - devicesdata.probe[0]?.adjustHum).toFixed(2)) < -100) {
        Swal.fire({
          title: t('alertHeaderWarning'),
          text: t('adjustHumGreater'),
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        })
        return
      }

      const response = await axios.put<responseType<devicesType>>(url, bodyData, { headers: { authorization: `Bearer ${token}` } })
      // setShow(false)
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
      fetchData(token)
      const deviceModel = devicesdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
      if (deviceModel === 'eTEMP') {
        client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/adj`, 'on')
      } else {
        client.publish(`siamatic/items/v3/${devicesdata.devSerial}/adj`, 'on')
      }
      client.publish(`${devicesdata.devSerial}/adj`, 'on')
      dispatch(setRefetchdata(!reFetchData))
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

  const handleSubmitNoti = async (e: FormEvent) => {
    e.preventDefault()
    if (
      muteMode.choichOne &&
      muteMode.choichtwo &&
      muteMode.choichthree &&
      muteMode.choichfour
    ) {
      const url: string = `${import.meta.env.VITE_APP_API}/config/${devicesdata.devSerial}`
      const bodyData = {
        notiTime: muteMode.choichOne === "immediately" ? 0 : sendTime.after,
        backToNormal: muteMode.choichtwo === "send" ? "0" : "1",
        repeat: muteMode.choichthree === "onetime" ? 0 : sendTime.every,
        mobileNoti: muteMode.choichfour === "on" ? "0" : "1",
        firstDay: scheduleDay.firstDay,
        secondDay: scheduleDay.seccondDay,
        thirdDay: scheduleDay.thirdDay,
        firstTime: `${scheduleTime.firstTime}${scheduleTime.firstMinute}`,
        secondTime: `${scheduleTime.secondTime}${scheduleTime.seccondMinute}`,
        thirdTime: `${scheduleTime.thirdTime}${scheduleTime.thirdMinute}`
      }
      try {
        const response = await axios.put<responseType<configType>>(url, bodyData, { headers: { authorization: `Bearer ${token}` } })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        fetchData(token)
        const deviceModel = devicesdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/adj`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/adj`, 'on')
        }
        client.publish(`${devicesdata.devSerial}/adj`, 'on')
        dispatch(setRefetchdata(!reFetchData))
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

  const closemodal = () => {
    const deviceModel = devicesdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
    if (deviceModel === 'eTEMP') {
      client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/temp`, 'off')
    } else {
      client.publish(`siamatic/items/v3/${devicesdata.devSerial}/temp`, 'off')
    }
    client.publish(`${devicesdata.devSerial}/temp`, 'off')
    setShow(false)
  }

  const openSetting = () => {
    setShow(false)
    setShowSetting(true)
  }

  const closeSetting = () => {
    setShowSetting(false)
    setShow(true)
  }

  const openSettingMute = () => {
    setShow(false)
    setShowSettingMute(true)
  }

  const closeSettingMute = () => {
    setShowSettingMute(false)
    setShow(true)
  }

  useEffect(() => {
    if (show) {
      client.subscribe(`${devicesdata.devSerial}/temp/real`, (err) => {
        if (err) {
          console.error("MQTT Suubscribe Error", err)
        }
      })

      const deviceModel = devicesdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
      if (deviceModel === 'eTEMP') {
        client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/temp`, 'on')
      } else {
        client.publish(`siamatic/items/v3/${devicesdata.devSerial}/temp`, 'on')
      }
      client.publish(`${devicesdata.devSerial}/temp`, 'on')

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

  const switchMute = (mode: string) => {
    const deviceModel = devicesdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
    if (mode === 'temporary') {
      setMuteEtemp({ ...muteEtemp, temporary: !muteEtemp.temporary })
      if (muteEtemp.temporary) {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/short`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/short`, 'on')
        }
        client.publish(`${devicesdata.devSerial}/mute/short`, 'on')
      } else {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/short`, 'off')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/short`, 'off')
        }
        client.publish(`${devicesdata.devSerial}/mute/short`, 'off')
      }
    } else if (mode === 'always') {
      setMuteEtemp({ ...muteEtemp, always: !muteEtemp.always })
      if (muteEtemp.always) {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/long`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/long`, 'on')
        }
        client.publish(`${devicesdata.devSerial}/mute/long`, 'on')
        cookies.remove(devicesdata.devSerial)
      } else {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/short`, 'off')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/short`, 'off')
        }
        client.publish(`${devicesdata.devSerial}/mute/long`, 'off')
        cookies.set(devicesdata.devSerial, 'always', cookieOptions)
      }
    } else {
      setMuteEtemp({ ...muteEtemp, door: !muteEtemp.door })
      if (muteEtemp.door) {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/door`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/door`, 'on')
        }
        client.publish(`${devicesdata.devSerial}/mute/door`, 'on')
        cookies.remove(devicesdata.devSerial)
      } else {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/short`, 'off')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/short`, 'off')
        }
        client.publish(`${devicesdata.devSerial}/mute/door`, 'off')
        cookies.set(devicesdata.devSerial, 'door', cookieOptions)
      }
    }
  }

  const selectProbe = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setSelectProbeI(selectedValue)
    const newProbeData = devicesdata.probe.filter((items) => items.probeId === selectedValue)
    setFormData({ ...formData, adjustTemp: newProbeData[0]?.adjustTemp, adjustHum: newProbeData[0]?.adjustHum })
    setHumvalue([newProbeData[0]?.humMin, newProbeData[0]?.humMax])
    setTempvalue([newProbeData[0]?.tempMin, newProbeData[0]?.tempMax])
  }

  const getScheduleDay = (e: SingleValue<Option>, key: string) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    switch (key) {
      case 'firstDay':
        setScheduleDay({ ...scheduleDay, firstDay: selectedValue })
        break
      case 'seccondDay':
        setScheduleDay({ ...scheduleDay, seccondDay: selectedValue })
        break
      case 'thirdDay':
        setScheduleDay({ ...scheduleDay, thirdDay: selectedValue })
        break
    }
  }

  const getScheduleTime = (e: SingleValue<Option>, key: string) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    switch (key) {
      case 'firstTime':
        setScheduleTime({ ...scheduleTime, firstTime: selectedValue })
        break
      case 'seccondTime':
        setScheduleTime({ ...scheduleTime, secondTime: selectedValue })
        break
      case 'thirdTime':
        setScheduleTime({ ...scheduleTime, thirdTime: selectedValue })
        break
    }
  }

  const getScheduleTimeMinute = (e: SingleValue<Option>, key: string) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    switch (key) {
      case 'firstTimeMinute':
        setScheduleTime({ ...scheduleTime, firstMinute: selectedValue })
        break
      case 'seccondTimeMinute':
        setScheduleTime({ ...scheduleTime, seccondMinute: selectedValue })
        break
      case 'thirdTimeMinute':
        setScheduleTime({ ...scheduleTime, thirdMinute: selectedValue })
        break
    }
  }

  const mapOptions = <T, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string ?? t('nameNotRegister')
    }))

  const mapvalue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
    data.filter(item => item[valueKey] === id).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string ?? t('nameNotRegister')
    }))[0]

  const filterOptions = (options: Option[], selectedValues: string[]) => {
    return options.filter(option => !selectedValues.includes(option.value))
  }

  return (
    <>
      <Modal size="lg" show={show} onHide={closemodal}>
        <Modal.Header>
          {/* <pre style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(formData)}
          </pre> */}
          <ModalHead>
            <strong>
              {devicesdata.devSerial}
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Form.Label>
                <span><b>{t('selectProbe')}</b></span>
                <LineHr />
                <Select
                  options={mapOptions<Ward, keyof Ward>(devicesdata.probe, 'probeId', 'probeName')}
                  value={mapvalue<Ward, keyof Ward>(devicesdata.probe, selectProbeI, 'probeId', 'probeName')}
                  onChange={selectProbe}
                  autoFocus={false}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                      borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                      boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                      borderRadius: "var(--border-radius-big)"
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary50: 'var(--main-color-opacity2)',
                      primary25: 'var(--main-color-opacity2)',
                      primary: 'var(--main-color)',
                    },
                  })}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </Form.Label>
            </Row>
            <Row className="mt-3">
              <Form.Label className="w-100 form-label">
                <span><b>{t('adjustMents')}</b></span>
                <LineHr />
              </Form.Label>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderFlex>
                      <SliderLabelFlex>
                        <span>{t('tempMin')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={-40}
                            max={tempvalue[1]}
                            step={.1}
                            value={tempvalue[0]}
                            onChange={(e) => setTempvalue([Number(e.target.value), tempvalue[1]])} />
                          <strong>°C</strong>
                        </div>
                      </SliderLabelFlex>
                      <SliderLabelFlex>
                        <span>{t('tempMax')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={tempvalue[0]}
                            max={120}
                            step={.1}
                            value={tempvalue[1]}
                            onChange={(e) => setTempvalue([tempvalue[0], Number(e.target.value)])} />
                          <strong>°C</strong>
                        </div>
                      </SliderLabelFlex>
                    </SliderFlex>
                    <SliderRangeFlex $rangename={'temp'}>
                      <Slider
                        value={tempvalue}
                        onChange={handleTempChange}
                        valueLabelDisplay="off"
                        disableSwap
                        min={-40}
                        max={120}
                        step={.1}
                      />
                    </SliderRangeFlex>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderFlex>
                      <SliderLabelFlex>
                        <span>{t('humiMin')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={0}
                            max={humvalue[1]}
                            step={.1}
                            value={humvalue[0]}
                            onChange={(e) => setHumvalue([Number(e.target.value), humvalue[1]])} />
                          <strong>%</strong>
                        </div>
                      </SliderLabelFlex>
                      <SliderLabelFlex>
                        <span>{t('humiMax')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={humvalue[0]}
                            max={100}
                            step={.1}
                            value={humvalue[1]}
                            onChange={(e) => setHumvalue([humvalue[0], Number(e.target.value)])} />
                          <strong>%</strong>
                        </div>
                      </SliderLabelFlex>
                    </SliderFlex>
                    <SliderRangeFlex $rangename={'hum'}>
                      <Slider
                        value={humvalue}
                        onChange={handleHumChange}
                        valueLabelDisplay="off"
                        disableSwap
                        min={0}
                        max={100}
                        step={.1}
                      />
                    </SliderRangeFlex>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderLabelFlex>
                      <span>{t('adjustTemp')}</span>
                      <div>
                        <RangeInputText
                          type="number"
                          min={-20}
                          max={20}
                          step={.01}
                          disabled={userLevel === '3' || userLevel === '2'}
                          value={formData.adjustTemp}
                          onChange={(e) => setFormData({ ...formData, adjustTemp: Number(e.target.value) })} />
                        <strong>°C</strong>
                      </div>
                    </SliderLabelFlex>
                    <FormSliderRange
                      $primary="temp"
                      $disabled={userLevel === '3' || userLevel === '2'}
                    >
                      <Slider
                        color="error"
                        min={-20}
                        max={20}
                        step={.01}
                        disabled={userLevel === '3' || userLevel === '2'}
                        value={formData.adjustTemp}
                        onChange={handleAdjusttempChange}
                        valueLabelDisplay="off" />
                    </FormSliderRange>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderLabelFlex>
                      <span>{t('adjustHumi')}</span>
                      <div>
                        <RangeInputText
                          type="number"
                          min={0}
                          max={100}
                          step={.01}
                          disabled={userLevel === '3' || userLevel === '2'}
                          value={formData.adjustHum}
                          onChange={(e) => setFormData({ ...formData, adjustHum: Number(e.target.value) })} />
                        <strong>%</strong>
                      </div>
                    </SliderLabelFlex>
                    <FormSliderRange
                      $primary="hum"
                      $disabled={userLevel === '3' || userLevel === '2'}
                    >
                      <Slider
                        color="primary"
                        min={0}
                        max={100}
                        step={.01}
                        disabled={userLevel === '3' || userLevel === '2'}
                        value={formData.adjustHum}
                        onChange={handleAdjusthumChange}
                        valueLabelDisplay="off" />
                    </FormSliderRange>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={12}>
                <AdjustRealTimeFlex $primary={Number((mqttData.temp + formData.adjustTemp).toFixed(2)) >= tempvalue[1] || Number((mqttData.temp + formData.adjustTemp).toFixed(2)) <= tempvalue[0]}>
                  <div>
                    <span>{t('currentTemp')}</span>
                    <div>
                      <span>
                        <span>{mqttData.temp.toFixed(2)}</span> °C
                      </span>
                    </div>
                  </div>
                  <RiArrowRightLine size={32} fill="grey" />
                  <RiArrowDownLine size={32} fill="grey" />
                  <div>
                    <span>{t('adjustAfterTemp')}</span>
                    <div>
                      <span>
                        <span>{(mqttData.temp + formData.adjustTemp - devicesdata.probe[0]?.adjustTemp).toFixed(2)}</span> °C
                      </span>
                    </div>
                  </div>
                </AdjustRealTimeFlex>
              </Col>
              <Col lg={12}>
                <AdjustRealTimeFlex $primary={Number((mqttData.humi + formData.adjustHum).toFixed(2)) >= humvalue[1] || Number((mqttData.humi + formData.adjustHum).toFixed(2)) <= humvalue[0]}>
                  <div>
                    <span>{t('currentHum')}</span>
                    <div>
                      <span>
                        <span>{mqttData.humi.toFixed(2)}</span> %
                      </span>
                    </div>
                  </div>
                  <RiArrowRightLine size={32} fill="grey" />
                  <RiArrowDownLine size={32} fill="grey" />
                  <div>
                    <span>{t('adjustAfterHum')}</span>
                    <div>
                      <span>
                        <span>{(mqttData.humi + formData.adjustHum - devicesdata.probe[0]?.adjustHum).toFixed(2)}</span> %
                      </span>
                    </div>
                  </div>
                </AdjustRealTimeFlex>
              </Col>
              <Col lg={12}>
                <Form.Label className="w-100">
                  <span><b>{t('muteSetting')}</b></span>
                  <LineHr />
                </Form.Label>
              </Col>
              <Col lg={12} className="w-100">
                <MuteFlex>
                  <OpenSettingBuzzer type="button" onClick={openSetting}>
                    <RiAlarmWarningFill size={24} />
                    <span>{t('notificationSettings')}</span>
                  </OpenSettingBuzzer>
                  <OpenSettingBuzzer type="button" onClick={openSettingMute}>
                    <RiBellFill size={24} />
                    <span>{t('muteSettings')}</span>
                  </OpenSettingBuzzer>
                </MuteFlex>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('adjustButtonSubmit')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal size="lg" show={showSetting} onHide={closeSetting}>
        <Modal.Header>
          <ModalHead>
            <ModalMuteHead onClick={closeSetting}>
              <button>
                <RiArrowLeftSLine />
              </button>
              <span>
                {t('notificationSettings')}
              </span>
            </ModalMuteHead>
            {/* <pre>{JSON.stringify(scheduleDay, null, 2)}</pre> */}
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmitNoti}>
          <Modal.Body>
            <Row>
              <Col lg={12}>
                <Form.Label className="w-100">
                  <span><b>{t('notificationSettings')}</b></span>
                </Form.Label>
              </Col>
              <Col lg={6}>
                <Row>
                  <Row>
                    <span>{t('choiceOne')}</span>
                  </Row>
                  <Row>
                    <Col className="mt-2">
                      <Form.Check
                        type='radio'
                        id='MessageImmediately'
                        label={t('messageimmediately')}
                        checked={choichOne === 'immediately'}
                        onChange={() => setMuteMode({ ...muteMode, choichOne: 'immediately' })}
                      />
                      <Form.Check
                        type='radio'
                        id='MessageAfter'
                        label={t('messageAfter')}
                        checked={choichOne === 'after'}
                        onChange={() => setMuteMode({ ...muteMode, choichOne: 'after' })}
                      />
                    </Col>
                    {choichOne === 'after' && <InputGroup className="mb-3 mt-2">
                      <ConfigBtn type="button" onClick={() => sendTime.after >= 10 && setSendTime({ ...sendTime, after: sendTime.after - 5 })}>-</ConfigBtn>
                      <Form.Control
                        type="number"
                        step={5}
                        min={5}
                        max={30}
                        value={sendTime.after}
                        onChange={(e) => setSendTime({ ...sendTime, after: Number(e.target.value) })}
                      />
                      <ConfigBtn type="button" onClick={() => sendTime.after <= 25 && setSendTime({ ...sendTime, after: sendTime.after + 5 })}>+</ConfigBtn>
                    </InputGroup>}
                  </Row>
                </Row>
                <Row className="mt-3">
                  <Row>
                    <span>{t('choiceTwo')}</span>
                  </Row>
                  <Row>
                    <Col className="mt-2">
                      <Form.Check
                        type='radio'
                        id='MessageSend'
                        label={t('messageSend')}
                        checked={choichtwo === 'send'}
                        onChange={() => setMuteMode({ ...muteMode, choichtwo: 'send' })}
                      />
                      <Form.Check
                        type='radio'
                        id='MessageDoNotSend'
                        label={t('messageDonotSend')}
                        checked={choichtwo === 'donotsend'}
                        onChange={() => setMuteMode({ ...muteMode, choichtwo: 'donotsend' })}
                      />
                    </Col>
                  </Row>
                </Row>
              </Col>
              <Col lg={6}>
                <Row className="mt-lg-0 mt-3">
                  <Row>
                    <span>{t('choiceThree')}</span>
                  </Row>
                  <Row>
                    <Col className="mt-2">
                      <Form.Check
                        type='radio'
                        id='MessageOneTime'
                        label={t('messageOneTime')}
                        checked={choichthree === 'onetime'}
                        onChange={() => setMuteMode({ ...muteMode, choichthree: 'onetime' })}
                      />
                      <Form.Check
                        type='radio'
                        id='MessageEvery'
                        label={t('messageEvery')}
                        checked={choichthree === 'every'}
                        onChange={() => setMuteMode({ ...muteMode, choichthree: 'every' })}
                      />
                      {choichthree === 'every' && <InputGroup className="mb-3 mt-2">
                        <ConfigBtn type="button" onClick={() => sendTime.every >= 10 && setSendTime({ ...sendTime, every: sendTime.every - 5 })}>-</ConfigBtn>
                        <Form.Control
                          type="number"
                          step={5}
                          min={5}
                          max={30}
                          value={sendTime.every}
                          onChange={(e) => setSendTime({ ...sendTime, every: Number(e.target.value) })}
                        />
                        <ConfigBtn type="button" onClick={() => sendTime.every <= 25 && setSendTime({ ...sendTime, every: sendTime.every + 5 })}>+</ConfigBtn>
                      </InputGroup>}
                    </Col>
                  </Row>
                </Row>
                <Row className="mt-3">
                  <Row>
                    <span>{t('choiceFour')}</span>
                  </Row>
                  <Row>
                    <Col className="mt-2">
                      <Form.Check
                        type='radio'
                        id='MessageOff'
                        label={t('messageOff')}
                        checked={choichfour === 'off'}
                        onChange={() => setMuteMode({ ...muteMode, choichfour: 'off' })}
                      />
                      <Form.Check
                        type='radio'
                        id='MessageOn'
                        label={t('messageOn')}
                        checked={choichfour === 'on'}
                        onChange={() => setMuteMode({ ...muteMode, choichfour: 'on' })}
                      />
                    </Col>
                  </Row>
                </Row>
              </Col>
              {/* <Col lg={12}>
                <ScheduleContainer>
                  <Form.Label className="w-100 mt-3">
                    <span><b>{t('scheduleTile')}</b></span>
                  </Form.Label>
                  <div onClick={() => {
                    setScheduleTime({
                      firstMinute: '',
                      firstTime: '',
                      seccondMinute: '',
                      secondTime: '',
                      thirdMinute: '',
                      thirdTime: ''
                    });

                    setScheduleDay({
                      firstDay: '',
                      seccondDay: '',
                      thirdDay: ''
                    });
                  }}>
                    <RiFormatClear size={20} />
                    <span>{t('clearShedule')}</span>
                  </div>
                </ScheduleContainer>
              </Col> */}
              <Col lg={12}>
                <ScheduleFlec>
                  <LineHr />
                  <span>{t('day')}</span>
                  <LineHr />
                </ScheduleFlec>
              </Col>
              <Col lg={12} className="my-3">
                <ScheduleItem>
                  <div>
                    <span>{t('firstDay')}</span>
                    <Select
                      isDisabled={scheduleDay.firstDay === 'ALL'}
                      key={String(scheduleDay.firstDay)}
                      options={filterOptions(
                        mapOptions<Schedule, keyof Schedule>(scheduleDayArray, 'scheduleKey', 'scheduleLabel'),
                        [String(scheduleDay.seccondDay), String(scheduleDay.thirdDay)]
                      )}
                      value={mapvalue<Schedule, keyof Schedule>(scheduleDayArray, String(scheduleDay.firstDay), 'scheduleKey', 'scheduleLabel')}
                      onChange={(e) => getScheduleDay(e, 'firstDay')}
                      autoFocus={false}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)",
                          width: "200px"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div>
                    <span>{t('seccondDay')}</span>
                    <Select
                      isDisabled={scheduleDay.seccondDay === 'ALL'}
                      key={String(scheduleDay.seccondDay)}
                      options={filterOptions(
                        mapOptions<Schedule, keyof Schedule>(scheduleDayArray, 'scheduleKey', 'scheduleLabel'),
                        [String(scheduleDay.firstDay), String(scheduleDay.thirdDay)]
                      )}
                      value={mapvalue<Schedule, keyof Schedule>(scheduleDayArray, String(scheduleDay.seccondDay), 'scheduleKey', 'scheduleLabel')}
                      onChange={(e) => getScheduleDay(e, 'seccondDay')}
                      autoFocus={false}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)",
                          width: "200px"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div>
                    <span>{t('thirdDay')}</span>
                    <Select
                      isDisabled={scheduleDay.thirdDay === 'ALL'}
                      key={String(scheduleDay.thirdDay)}
                      options={filterOptions(
                        mapOptions<Schedule, keyof Schedule>(scheduleDayArray, 'scheduleKey', 'scheduleLabel'),
                        [String(scheduleDay.firstDay), String(scheduleDay.seccondDay)]
                      )}
                      value={mapvalue<Schedule, keyof Schedule>(scheduleDayArray, String(scheduleDay.thirdDay), 'scheduleKey', 'scheduleLabel')}
                      onChange={(e) => getScheduleDay(e, 'thirdDay')}
                      autoFocus={false}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)",
                          width: "200px"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div>
                    <span>{t('everyDays')}</span>
                    <ToggleButtonAllDays type="button" $primary={scheduleDay.firstDay === 'ALL' && scheduleDay.seccondDay === 'ALL' && scheduleDay.thirdDay === 'ALL' ? true : false} onClick={() => {
                      if (scheduleDay.firstDay === 'ALL' && scheduleDay.seccondDay === 'ALL' && scheduleDay.thirdDay === 'ALL') {
                        setScheduleDay({ firstDay: '', seccondDay: '', thirdDay: '' })
                      } else {
                        setScheduleDay({ firstDay: 'ALL', seccondDay: 'ALL', thirdDay: 'ALL' })
                      }
                    }}>
                      <div className="icon">
                        {scheduleDay.firstDay === 'ALL' && scheduleDay.seccondDay === 'ALL' && scheduleDay.thirdDay === 'ALL' ? t('messageOn') : t('messageOff')}
                      </div>
                    </ToggleButtonAllDays>
                  </div>
                </ScheduleItem>
              </Col>
              <Col lg={12}>
                <ScheduleFlec>
                  <LineHr />
                  <span>{t('deviceTime')}</span>
                  <LineHr />
                </ScheduleFlec>
              </Col>
              <Col lg={12} className="mt-3">
                <ScheduleItemFlex>
                  <span>{t('firstTime')}</span>
                  <div>
                    <Select
                      // key={String(scheduleTime.firstTime)}
                      options={filterOptions(
                        mapOptions<ScheduleHour, keyof ScheduleHour>(scheduleTimeArray, 'scheduleHourKey', 'scheduleHourLabel'),
                        [String(scheduleTime.secondTime), String(scheduleTime.thirdTime)]
                      )}
                      value={mapvalue<ScheduleHour, keyof ScheduleHour>(scheduleTimeArray, String(scheduleTime.firstTime), 'scheduleHourKey', 'scheduleHourLabel')}
                      onChange={(e) => getScheduleTime(e, 'firstTime')}
                      autoFocus={false}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)",
                          width: "200px"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                    <Select
                      // key={String(scheduleTime.firstMinute)}
                      options={mapOptions<ScheduleMinute, keyof ScheduleMinute>(scheduleMinuteArray, 'scheduleMinuteKey', 'scheduleMinuteLabel')}
                      value={mapvalue<ScheduleMinute, keyof ScheduleMinute>(scheduleMinuteArray, String(scheduleTime.firstMinute), 'scheduleMinuteKey', 'scheduleMinuteLabel')}
                      onChange={(e) => getScheduleTimeMinute(e, 'firstTimeMinute')}
                      autoFocus={false}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)",
                          width: "200px"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </ScheduleItemFlex>
              </Col>
              <Col lg={12} className="mt-3">
                <ScheduleItemFlex>
                  <span>{t('seccondTime')}</span>
                  <div>
                    <Select
                      // key={String(scheduleTime.secondTime)}
                      options={filterOptions(
                        mapOptions<ScheduleHour, keyof ScheduleHour>(scheduleTimeArray, 'scheduleHourKey', 'scheduleHourLabel'),
                        [String(scheduleTime.firstTime), String(scheduleTime.thirdTime)]
                      )}
                      value={mapvalue<ScheduleHour, keyof ScheduleHour>(scheduleTimeArray, String(scheduleTime.secondTime), 'scheduleHourKey', 'scheduleHourLabel')}
                      onChange={(e) => getScheduleTime(e, 'seccondTime')}
                      autoFocus={false}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)",
                          width: "200px"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                    <Select
                      // key={String(scheduleTime.seccondMinute)}
                      options={mapOptions<ScheduleMinute, keyof ScheduleMinute>(scheduleMinuteArray, 'scheduleMinuteKey', 'scheduleMinuteLabel')}
                      value={mapvalue<ScheduleMinute, keyof ScheduleMinute>(scheduleMinuteArray, String(scheduleTime.seccondMinute), 'scheduleMinuteKey', 'scheduleMinuteLabel')}
                      onChange={(e) => getScheduleTimeMinute(e, 'seccondTimeMinute')}
                      autoFocus={false}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)",
                          width: "200px"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </ScheduleItemFlex>
              </Col>
              <Col lg={12} className="mt-3">
                <ScheduleItemFlex>
                  <span>{t('thirdTime')}</span>
                  <div>
                    <Select
                      // key={String(scheduleTime.thirdTime)}
                      options={filterOptions(
                        mapOptions<ScheduleHour, keyof ScheduleHour>(scheduleTimeArray, 'scheduleHourKey', 'scheduleHourLabel'),
                        [String(scheduleTime.firstTime), String(scheduleTime.secondTime)]
                      )}
                      value={mapvalue<ScheduleHour, keyof ScheduleHour>(scheduleTimeArray, String(scheduleTime.thirdTime), 'scheduleHourKey', 'scheduleHourLabel')}
                      onChange={(e) => getScheduleTime(e, 'thirdTime')}
                      autoFocus={false}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)",
                          width: "200px"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                    <Select
                      // key={String(scheduleTime.thirdMinute)}
                      options={mapOptions<ScheduleMinute, keyof ScheduleMinute>(scheduleMinuteArray, 'scheduleMinuteKey', 'scheduleMinuteLabel')}
                      value={mapvalue<ScheduleMinute, keyof ScheduleMinute>(scheduleMinuteArray, String(scheduleTime.thirdMinute), 'scheduleMinuteKey', 'scheduleMinuteLabel')}
                      onChange={(e) => getScheduleTimeMinute(e, 'thirdTimeMinute')}
                      autoFocus={false}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)",
                          width: "200px"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </ScheduleItemFlex>
              </Col>
            </Row>

          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('notificationButtonSubmit')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal size="lg" show={showSettingMute} onHide={closeSettingMute}>
        <Modal.Header>
          <ModalHead>
            <ModalMuteHead onClick={closeSettingMute}>
              <button>
                <RiArrowLeftSLine />
              </button>
              <span>
                {t('muteSettings')}
              </span>
            </ModalMuteHead>
          </ModalHead>
        </Modal.Header>
        <Modal.Body>
          <NotiActionFlex>
            <div>
              <span>{t('muteTemporary')}</span>
              <MuteEtemp type="button" onClick={() => switchMute('temporary')} $primary={!muteEtemp.temporary}>
                <div className="icon">
                  {!muteEtemp.temporary ? t('stateOn') : t('stateOff')}
                </div>
              </MuteEtemp>
            </div>
            <div>
              <span>{t('muteAlways')}</span>
              <MuteEtemp type="button" onClick={() => switchMute('always')} $primary={!muteEtemp.always}>
                <div className="icon">
                  {!muteEtemp.always ? t('stateOn') : t('stateOff')}
                </div>
              </MuteEtemp>
            </div>
            <div>
              <span>{t('muteDoor')}</span>
              <MuteEtemp type="button" onClick={() => switchMute('door')} $primary={!muteEtemp.door}>
                <div className="icon">
                  {!muteEtemp.door ? t('stateOn') : t('stateOff')}
                </div>
              </MuteEtemp>
            </div>
          </NotiActionFlex>
        </Modal.Body>
        <Modal.Footer>
          <FormFlexBtn>
            <FormBtn type="submit">
              {t('notificationButtonSubmit')}
            </FormBtn>
          </FormFlexBtn>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalAdjust