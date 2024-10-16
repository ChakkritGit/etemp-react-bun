import { useTranslation } from "react-i18next"
import { ManageProbeAdd } from "../../../style/components/manage.probe"
import { addprobeProps } from "../../../types/prop.type"
import { RiAddLine, RiCloseLine, RiEditLine } from "react-icons/ri"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import { FormBtn, FormFlexBtn, ModalHead } from "../../../style/style"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"
import axios, { AxiosError } from "axios"
import { responseType } from "../../../types/response.type"
import { probeType } from "../../../types/probe.type"
import { storeDispatchType } from "../../../stores/store"
import { fetchProbeData } from "../../../stores/probeSlice"
import { client } from "../../../services/mqtt"
import { setRefetchdata, setShowAlert } from "../../../stores/utilsStateSlice"
import Select, { SingleValue } from 'react-select'
import { useTheme } from "../../../theme/ThemeProvider"
import Adjustment from "../../../components/adjustments/adjustment"
import { devicesType } from "../../../types/device.type"

type Option = {
  value: string,
  label: string,
}

type Probe = {
  devSerial: string
}

type OptionData = {
  value: string,
  name: string
}

export default function Addprobe(addprobe: addprobeProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { pagestate, probeData } = addprobe
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [show, setShow] = useState(false)
  const [formdata, setFormdata] = useState({
    probeName: pagestate !== "add" ? probeData?.probeName : '',
    probeType: pagestate !== "add" ? probeData?.probeType : '',
    probeCh: pagestate !== "add" ? probeData?.probeCh : '',
    devSerial: pagestate !== "add" ? probeData?.devSerial : '',
    adjustTemp: pagestate !== "add" ? probeData?.adjustTemp : '',
    adjustHum: pagestate !== "add" ? probeData?.adjustHum : '',
    delay_time: pagestate !== "add" ? probeData?.delayTime : '',
    door: pagestate !== "add" ? probeData?.door : '',
    location: pagestate !== "add" ? probeData?.location : '',
    tempvalue: [pagestate !== "add" ? Number(probeData?.tempMin) : 0, pagestate !== "add" ? Number(probeData?.tempMax) : 0],
    humvalue: [pagestate !== "add" ? Number(probeData?.humMin) : 0, pagestate !== "add" ? Number(probeData?.humMax) : 0]
  })
  const [mqttData, setMqttData] = useState({ temp: 0, humi: 0 })
  const { theme } = useTheme()
  const deviceModel = probeData?.device.devSerial?.substring(0, 3) === "eTP" ? "etemp" : "items"
  const version = probeData?.device.devSerial?.substring(3, 5).toLowerCase()

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    if (deviceModel === 'etemp') {
      client.publish(`siamatic/${deviceModel}/${version}/${probeData?.device.devSerial}/temp`, 'off')
    } else {
      client.publish(`siamatic/${deviceModel}/${version}/${probeData?.device.devSerial}/temp`, 'off')
    }
    client.publish(`${probeData?.devSerial}/temp`, 'off')
    setShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/probe`
    const bodyData = {
      probeName: formdata.probeName,
      probeType: formdata.probeType,
      probeCh: formdata.probeCh,
      devSerial: formdata.devSerial,
      adjustTemp: formdata.adjustTemp,
      adjustHum: formdata.adjustHum,
      delayTime: formdata.delay_time,
      door: Number(formdata.door),
      location: formdata.location,
      tempMin: formdata.tempvalue[0],
      tempMax: formdata.tempvalue[1],
      humMin: formdata.humvalue[0],
      humMax: formdata.humvalue[1],
    }
    if (formdata.devSerial !== '' && formdata.adjustTemp !== '' && formdata.adjustHum !== '' && formdata.door !== '' && formdata.delay_time !== ''
      && formdata.probeName !== '' && formdata.probeType !== '' && formdata.probeCh !== '' && formdata.location !== '' && formdata.tempvalue !== null && formdata.humvalue !== null) {
      try {
        const response = await axios.post<responseType<probeType>>(url, bodyData, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        setFormdata({ ...formdata, tempvalue: [0, 0] })
        closemodal()
        dispatch(fetchProbeData(token))
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

  const handleSubmitedit = async (e: FormEvent) => {
    e.preventDefault()
    const bodyData = {
      probeName: formdata.probeName,
      probeType: formdata.probeType,
      probeCh: formdata.probeCh,
      devId: formdata.devSerial,
      adjustTemp: formdata.adjustTemp,
      adjustHum: formdata.adjustHum,
      delayTime: formdata.delay_time,
      door: Number(formdata.door),
      location: formdata.location,
      tempMin: formdata.tempvalue[0],
      tempMax: formdata.tempvalue[1],
      humMin: formdata.humvalue[0],
      humMax: formdata.humvalue[1],
    }
    if (formdata.devSerial !== '' && formdata.adjustTemp !== '' && formdata.adjustHum !== '' && formdata.door !== '' && formdata.delay_time !== ''
      && formdata.probeName !== '' && formdata.probeType !== '' && formdata.probeCh !== '' && formdata.location !== null && formdata.tempvalue !== null && formdata.humvalue !== null) {
      try {
        const response = await axios.put<responseType<probeType>>(`${import.meta.env.VITE_APP_API}/probe/${probeData?.probeId}`, bodyData, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        closemodal()
        dispatch(setRefetchdata(true))
        if (deviceModel === 'etemp') {
          client.publish(`siamatic/${deviceModel}/${version}/${probeData?.device.devSerial}/adj`, 'on')
        } else {
          client.publish(`siamatic/${deviceModel}/${version}/${probeData?.device.devSerial}/adj`, 'on')
        }
        client.publish(`${probeData?.device.devSerial}/adj`, 'on')
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

  const handleTempChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, tempvalue: newValue as number[] })
  }
  const handleHumChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, humvalue: newValue as number[] })
  }
  const handleAdjusttempChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjustTemp: newValue as number })
  }
  const handleAdjusthumChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjustHum: newValue as number })
  }

  const delayTime = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormdata({ ...formdata, delay_time: selectedValue })
  }
  const doorSelected = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormdata({ ...formdata, door: selectedValue })
  }
  const deviceSelected = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormdata({ ...formdata, devSerial: selectedValue })
  }
  const channelSelected = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormdata({ ...formdata, probeCh: selectedValue })
  }

  const delayTimeArray = [
    { value: '5', name: t('probe5Minute') },
    { value: '15', name: t('probe15Minute') },
    { value: '30', name: t('probe30Minute') },
    { value: '60', name: t('probe1Hour') },
    { value: '120', name: t('probe2Hour') },
    { value: '240', name: t('probe4Hour') },
  ]

  const doorArray = [
    { value: '1', name: t('probeDoor1') },
    { value: '2', name: t('probeDoor2') },
    { value: '3', name: t('probeDoor3') },
  ]

  const channelArray = [
    { value: '1', name: t('probeChanel1') },
    { value: '2', name: t('probeChanel2') },
    { value: '3', name: t('probeChanel3') },
    { value: '4', name: t('probeChanel4') },
  ]

  useEffect(() => {
    if (show) {
      client.subscribe(`${probeData?.devSerial}/temp/real`, (err) => {
        if (err) {
          console.error("MQTT Suubscribe Error", err)
        }
      })

      if (deviceModel === 'etemp') {
        client.publish(`siamatic/${deviceModel}/${version}/${probeData?.device.devSerial}/temp`, 'on')
      } else {
        client.publish(`siamatic/i${deviceModel}/${version}/${probeData?.device.devSerial}/temp`, 'on')
      }

      client.publish(`${probeData?.devSerial}/temp`, 'on')

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

  const mapOptions = <T, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
    data.filter(item => item[valueKey] === id).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

  const setTempvalue = (newTempvalue: number[] | ((prevState: number[]) => number[])) => {
    setFormdata(prevState => ({
      ...prevState,
      tempvalue: typeof newTempvalue === 'function' ? newTempvalue(prevState.tempvalue) : newTempvalue
    }))
  }

  const setHumvalue = (newHumvalue: number[] | ((prevState: number[]) => number[])) => {
    setFormdata(prevState => ({
      ...prevState,
      humvalue: typeof newHumvalue === 'function' ? newHumvalue(prevState.humvalue) : newHumvalue
    }))
  }

  useEffect(() => {
    if (show) {
      setFormdata({
        probeName: pagestate !== "add" ? probeData?.probeName : '',
        probeType: pagestate !== "add" ? probeData?.probeType : '',
        probeCh: pagestate !== "add" ? probeData?.probeCh : '',
        devSerial: pagestate !== "add" ? probeData?.devSerial : '',
        adjustTemp: pagestate !== "add" ? probeData?.adjustTemp : '',
        adjustHum: pagestate !== "add" ? probeData?.adjustHum : '',
        delay_time: pagestate !== "add" ? probeData?.delayTime : '',
        door: pagestate !== "add" ? probeData?.door : '',
        location: pagestate !== "add" ? probeData?.location : '',
        tempvalue: [pagestate !== "add" ? Number(probeData?.tempMin) : 0, pagestate !== "add" ? Number(probeData?.tempMax) : 0],
        humvalue: [pagestate !== "add" ? Number(probeData?.humMin) : 0, pagestate !== "add" ? Number(probeData?.humMax) : 0]
      })
    }
  }, [show])

  return (
    <>
      {
        pagestate == 'add' ?
          <ManageProbeAdd onClick={openmodal}>
            {t('addProbe')}
            <RiAddLine />
          </ManageProbeAdd>
          :
          <ManageProbeAdd onClick={openmodal} $primary >
            <RiEditLine size={16} />
          </ManageProbeAdd>
      }

      <Modal size={"lg"} show={show} onHide={closemodal}>
        <Modal.Header>
          <ModalHead $primary>
            <div>
              <strong>
                {
                  pagestate === "add" ?
                    t('addProbe')
                    :
                    t('editProbe')
                }
              </strong>
              <span>{probeData?.devSerial}</span>
            </div>
            {/* <pre>{JSON.stringify(formdata, null, 2)}</pre> */}
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitedit}>
          <Modal.Body>
            <Row>
              {
                pagestate === "add" ?
                  <Col lg={12}>
                    <InputGroup className="mb-3">
                      <Form.Label className="w-100">
                        {t('selectDeviceDrop')}
                        <Select
                          options={mapOptions<Probe, keyof Probe>(devices, 'devSerial', 'devSerial')}
                          value={mapDefaultValue<Probe, keyof Probe>(devices, formdata.devSerial || '0', 'devSerial', 'devSerial')}
                          onChange={deviceSelected}
                          autoFocus={false}
                          placeholder={t('selectDeviceDrop')}
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
                    </InputGroup>
                  </Col>
                  :
                  <></>
              }
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('probeName')}
                    <Form.Control
                      name='form_label_hosaddress'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.probeName}
                      onChange={(e) => setFormdata({ ...formdata, probeName: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('probeType')}
                    <Form.Control
                      name='form_label_hosaddress'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.probeType}
                      onChange={(e) => setFormdata({ ...formdata, probeType: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('probeLocation')}
                    <Form.Control
                      name='form_label_hosaddress'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.location}
                      onChange={(e) => setFormdata({ ...formdata, location: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={4}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('delay')}
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(delayTimeArray, 'value', 'name')}
                      value={mapDefaultValue<OptionData, keyof OptionData>(delayTimeArray, formdata.delay_time || '0', 'value', 'name')}
                      onChange={delayTime}
                      autoFocus={false}
                      placeholder={t('selectDelay')}
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
                </InputGroup>
              </Col>
              <Col lg={4}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('door')}
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(doorArray, 'value', 'name')}
                      value={mapDefaultValue<OptionData, keyof OptionData>(doorArray, String(formdata.door) || '0', 'value', 'name')}
                      onChange={doorSelected}
                      autoFocus={false}
                      placeholder={t('selectDoor')}
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
                </InputGroup>
              </Col>
              <Col lg={4}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('probeChanel')}
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(channelArray, 'value', 'name')}
                      value={mapDefaultValue<OptionData, keyof OptionData>(channelArray, String(formdata.probeCh) || '0', 'value', 'name')}
                      onChange={channelSelected}
                      autoFocus={false}
                      placeholder={t('selectChanel')}
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
                </InputGroup>
              </Col>
              <Adjustment
                devicesdata={{
                  probe: [{ adjustTemp: probeData?.adjustTemp, adjustHum: probeData?.adjustHum }]
                } as devicesType}
                formData={{
                  adjustTemp: Number(formdata.adjustTemp),
                  adjustHum: Number(formdata.adjustHum)
                }}
                handleAdjusthumChange={handleAdjusthumChange}
                handleAdjusttempChange={handleAdjusttempChange}
                handleHumChange={handleHumChange}
                handleTempChange={handleTempChange}
                humvalue={formdata.humvalue}
                tempvalue={formdata.tempvalue}
                mqttData={mqttData}
                setFormData={setFormdata as Dispatch<SetStateAction<{
                  adjustTemp: number;
                  adjustHum: number;
                }>>}
                setTempvalue={setTempvalue}
                setHumvalue={setHumvalue}
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
    </>
  )
}
