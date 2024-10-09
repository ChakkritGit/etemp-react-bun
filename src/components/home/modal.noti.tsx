import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import { FormBtn, FormFlexBtn, LineHr, ModalHead } from "../../style/style"
import { ModalMuteHead, ScheduleFlec, ScheduleItem, ScheduleItemFlex, ToggleButtonAllDays } from "../../style/components/home.styled"
import { RiArrowLeftSLine } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import { ConfigBtn } from "../../style/components/manage.config"
import Select, { SingleValue } from 'react-select'
import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { AsyncThunk } from "@reduxjs/toolkit"
import { devicesType } from "../../types/device.type"
import { configType, Option, Schedule, ScheduleHour, ScheduleMinute } from "../../types/config.type"
import { useTheme } from "../../theme/ThemeProvider"
import { scheduleDayArray, scheduleMinuteArray, scheduleTimeArray } from "../../constants/constants"
import Swal from "sweetalert2"
import axios, { AxiosError } from "axios"
import { responseType } from "../../types/response.type"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { useDispatch, useSelector } from "react-redux"
import { client } from "../../services/mqtt"
import { storeDispatchType } from "../../stores/store"
import { setRefetchdata, setShowAlert } from "../../stores/utilsStateSlice"

type modalAdjustType = {
  fetchData: AsyncThunk<devicesType[], string, {}>,
  devicesdata: devicesType,
  setShowSetting: Dispatch<SetStateAction<boolean>>,
  showSetting: boolean,
  setShow: Dispatch<SetStateAction<boolean>>,
}


function ModalNotification(modalProps: modalAdjustType) {
  const { fetchData, devicesdata, showSetting, setShowSetting, setShow } = modalProps
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
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
  const { theme } = useTheme()
  const { token } = cookieDecode

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
        dispatch(setRefetchdata(true))
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

  const filterOptions = (options: Option[], selectedValues: string[]) => {
    return options.filter(option => !selectedValues.includes(option.value))
  }

  const closeSetting = () => {
    setShowSetting(false)
    setShow(true)
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

  return (
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
  )
}

export default ModalNotification