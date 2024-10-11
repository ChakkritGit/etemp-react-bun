import { Col, Form, Modal, Row } from "react-bootstrap"
import {
  FormBtn, FormFlexBtn, LineHr, ModalHead,
} from "../../style/style"
import { RiAlarmWarningFill, RiBellFill, RiCloseLine } from "react-icons/ri"
import {
  MuteFlex,
  OpenSettingBuzzer
} from "../../style/components/home.styled"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { AsyncThunk } from "@reduxjs/toolkit"
import { devicesType } from "../../types/device.type"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { responseType } from "../../types/response.type"
import { client } from "../../services/mqtt"
import { Option, Ward } from "../../types/config.type"
import { storeDispatchType } from "../../stores/store"
import { setRefetchdata, setShowAlert } from "../../stores/utilsStateSlice"
import { useTheme } from "../../theme/ThemeProvider"
import axios, { AxiosError } from "axios"
import Select, { SingleValue } from 'react-select'
import Swal from "sweetalert2"
import Adjustment from "../adjustments/adjustment"

type modalAdjustType = {
  fetchData: AsyncThunk<devicesType[], string, {}>,
  devicesdata: devicesType,
  setShow: Dispatch<SetStateAction<boolean>>,
  show: boolean,
  openSetting: () => void,
  openSettingMute: () => void
}

const ModalAdjust = (modalProps: modalAdjustType) => {
  const { fetchData, devicesdata, show, setShow, openSetting, openSettingMute } = modalProps
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [tempvalue, setTempvalue] = useState<number[]>([Number(devicesdata.probe[0]?.tempMin), Number(devicesdata.probe[0]?.tempMax)])
  const [humvalue, setHumvalue] = useState<number[]>([Number(devicesdata.probe[0]?.humMin), Number(devicesdata.probe[0]?.humMax)])

  const [formData, setFormData] = useState({
    adjustTemp: devicesdata.probe[0]?.adjustTemp,
    adjustHum: devicesdata.probe[0]?.adjustHum
  })

  const [mqttData, setMqttData] = useState({ temp: 0, humi: 0 })
  const [selectProbeI, setSelectProbeI] = useState(devicesdata.probe[0]?.probeId)

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

  const selectProbe = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setSelectProbeI(selectedValue)
    const newProbeData = devicesdata.probe.filter((items) => items.probeId === selectedValue)
    setFormData({ ...formData, adjustTemp: newProbeData[0]?.adjustTemp, adjustHum: newProbeData[0]?.adjustHum })
    setHumvalue([newProbeData[0]?.humMin, newProbeData[0]?.humMax])
    setTempvalue([newProbeData[0]?.tempMin, newProbeData[0]?.tempMax])
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
            <Adjustment
              devicesdata={devicesdata}
              formData={formData}
              handleAdjusthumChange={handleAdjusthumChange}
              handleAdjusttempChange={handleAdjusttempChange}
              handleHumChange={handleHumChange}
              handleTempChange={handleTempChange}
              humvalue={humvalue}
              mqttData={mqttData}
              setFormData={setFormData}
              setHumvalue={setHumvalue}
              setTempvalue={setTempvalue}
              tempvalue={tempvalue}
            />
            <Col lg={12}>
              <Form.Label className="w-100">
                <span><b>{t('muteSetting')}</b></span>
                <LineHr />
              </Form.Label>
            </Col>
            <Col lg={12} className="w-100">
              <MuteFlex>
                <OpenSettingBuzzer type="button" onClick={() => { openSetting(); closemodal(); }}>
                  <RiAlarmWarningFill size={24} />
                  <span>{t('notificationSettings')}</span>
                </OpenSettingBuzzer>
                <OpenSettingBuzzer type="button" onClick={() => { openSettingMute(); closemodal(); }}>
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
  )
}

export default ModalAdjust