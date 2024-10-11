import { AddDevices, FormBtn, FormFlexBtn, ModalHead, ProfileFlex } from '../../../style/style'
import { RiAddLine, RiArrowLeftSLine, RiCloseLine, RiEditLine, RiListSettingsLine, RiMessage3Line } from 'react-icons/ri'
import { devicesType, managedevices } from '../../../types/device.type'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Col, Modal, Row, Form, InputGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import axios, { AxiosError } from 'axios'
import Swal from 'sweetalert2'
import HospitalDropdown from '../../../components/dropdown/hospitalDropdown'
import WardDropdown from '../../../components/dropdown/wardDropdown'
import { useDispatch } from 'react-redux'
import { storeDispatchType } from '../../../stores/store'
import { useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../../../types/redux.type'
import { fetchDevicesData } from '../../../stores/devicesSlices'
import { responseType } from '../../../types/response.type'
import { ManageConfigAdd, ModeNetworkFlex } from '../../../style/components/manage.config'
import { ModalMuteHead } from '../../../style/components/home.styled'
import { configType } from '../../../types/config.type'
import { client } from '../../../services/mqtt'
import { wardsType } from '../../../types/ward.type'
import { SendOTAtoBoard, UploadButton } from '../../../style/components/firmwareuoload'
import { firmwareType } from '../../../types/component.type'
import { setShowAlert } from '../../../stores/utilsStateSlice'
import { hoursOptions, mapDefaultValue, mapOptions, minutesOptions, resizeImage } from '../../../constants/constants'
import { TabButton, TabContainer } from '../../../style/components/manage.dev'
import Select from 'react-select'
import { useTheme } from '../../../theme/ThemeProvider'

interface FirmwareItem {
  fileName: string,
}

type selectOption = {
  value: string,
  label: string
}

export default function Adddevform(managedevices: managedevices) {
  const { devdata, pagestate } = managedevices
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [formdata, setFormdata] = useState({
    devZone: pagestate !== "add" ? devdata.devZone : '',
    devLocation: pagestate !== "add" ? devdata.locInstall : '',
    groupId: pagestate !== "add" ? devdata.wardId || '' : '',
    devId: pagestate !== "add" ? devdata.devId : '',
    devName: pagestate !== "add" ? devdata.devDetail : '',
    devSn: pagestate !== "add" ? devdata.devSerial : '',
    locationPic: null as File | null,
    macAddWiFi: pagestate !== "add" ? devdata.config.macAddWiFi : ''
  })
  const dispatch = useDispatch<storeDispatchType>()
  const { cookieDecode, tokenDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token, userLevel } = cookieDecode
  const [devicePicture, setDevicePicture] = useState<string>(devdata.locPic ? `${import.meta.env.VITE_APP_IMG}${devdata.locPic}` : '')
  const { config } = devdata
  const [resetTime, setResetTime] = useState<{
    resetHour: string | undefined,
    resetMinute: string | undefined
  }>({
    resetHour: config?.hardReset ? config.hardReset.substring(0, 2) : '',
    resetMinute: config?.hardReset ? config.hardReset.substring(2, 4) : ''
  })
  const [netConfig, setNetConfig] = useState({
    devSerial: config?.devSerial ? config.devSerial : '',
    SSID: config?.ssid ? config.ssid : '',
    Password: config?.ssidPass ? config.ssidPass : '',
    MacAddress: config?.macAddWiFi ? config.macAddWiFi : '',
    IP: config?.ip ? config.ip : '',
    Subnet: config?.subNet ? config.subNet : '',
    Gateway: config?.getway ? config.getway : '',
    DNS: config?.dns ? config.dns : '',
    ipEth: config?.ipEth ? config.ipEth : '',
    subNetEth: config?.subNetEth ? config.subNetEth : '',
    getwayEth: config?.getwayEth ? config.getwayEth : '',
    dnsEth: config?.dnsEth ? config.dnsEth : '',
    hardReset: ''
  })
  const [firmwareName, setFirmwareName] = useState<string>('')
  const [firmwareList, setFirmwareList] = useState<firmwareType[]>([])
  const [Mode, setMode] = useState({
    wifi: config?.mode ? Number(config.mode) : 0,
    lan: config?.modeEth ? Number(config.modeEth) : 0,
    sim: config?.sim ? config?.sim : ''
  })
  const [tabs, setTabs] = useState(1)
  const [hosid, setHosid] = useState('')
  const { theme } = useTheme()
  const { resetHour, resetMinute } = resetTime

  const fetchWard = async () => {
    try {
      const response = await axios.get<responseType<wardsType>>(`${import.meta.env.VITE_APP_API}/ward/${devdata.wardId}`, { headers: { authorization: `Bearer ${token}` } })
      setHosid(response.data.data.hospital.hosId)
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

  useEffect(() => {
    setNetConfig({ ...netConfig, hardReset: `${resetHour}${resetMinute}` })
  }, [resetHour, resetMinute])

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    setShow(false)
  }

  const openmodalConfig = () => {
    setShow(false)
    setShowConfig(true)
  }

  const closemodalConfig = () => {
    setShowConfig(false)
    setShow(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/device`
    if (formdata.devSn !== "") {
      try {
        const response = await axios.post<responseType<devicesType>>(url, {
          devSerial: formdata.devSn,
          createBy: tokenDecode.userId,
          config: {
            macAddWiFi: formdata.macAddWiFi
          }
        }, { headers: { authorization: `Bearer ${token}` } })
        setShow(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        setFormdata({ ...formdata, devSn: '' })
        dispatch(fetchDevicesData(token))
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

  const handleSubmitEdit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/device/${devdata?.devId}`
    const urlcongif: string = `${import.meta.env.VITE_APP_API}/config/${netConfig.devSerial}`
    const formData = new FormData()
    formData.append('devZone', formdata.devZone as string)
    formData.append('locInstall', formdata.devLocation as string)
    formData.append('wardId', formdata.groupId as string)
    formData.append('devDetail', formdata.devName as string)
    formData.append('devSerial', formdata.devSn as string)
    if (formdata.locationPic) {
      formData.append('fileupload', formdata.locationPic as File)
    }
    if (formdata.devId !== '') {
      try {
        const response = await axios.put<responseType<devicesType>>(url, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`
          }
        })
        if (netConfig.hardReset !== '') {
          await axios.put<responseType<devicesType>>(urlcongif, {
            hardReset: netConfig.hardReset
          }, {
            headers: {
              authorization: `Bearer ${token}`
            }
          })
        }
        setShow(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        dispatch(fetchDevicesData(token))
        const deviceModel = devdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devdata.devSerial}/adj`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${devdata.devSerial}/adj`, 'on')
        }
        client.publish(`${devdata.devSerial}/adj`, 'on')
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

  const handleSubmitDHCP = async (e: FormEvent) => {
    e.preventDefault()
    const { MacAddress, Password, SSID } = netConfig
    try {
      const bodyData = {
        mode: "0",
        ssid: SSID,
        ssidPass: Password,
        macAddWiFi: MacAddress,
      }
      const response = await axios.put<responseType<configType>>(`${import.meta.env.VITE_APP_API}/config/${netConfig.devSerial}`,
        bodyData, {
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
      dispatch(fetchDevicesData(token))
      const deviceModel = devdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
      if (deviceModel === 'eTEMP') {
        client.publish(`siamatic/etemp/v1/${devdata.devSerial}/adj`, 'on')
      } else {
        client.publish(`siamatic/items/v3/${devdata.devSerial}/adj`, 'on')
      }
      client.publish(`${devdata.devSerial}/adj`, 'on')
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

  const handleSubmitManual = async (e: FormEvent) => {
    e.preventDefault()
    const { DNS, Gateway, IP, Subnet } = netConfig
    if (IP !== '' && Subnet !== '' && Gateway !== '' && DNS !== '') {
      try {
        const bodyData = {
          mode: "1",
          ip: IP,
          subNet: Subnet,
          getway: Gateway,
          dns: DNS
        }
        const response = await axios.put<responseType<configType>>(`${import.meta.env.VITE_APP_API}/config/${netConfig.devSerial}`,
          bodyData, {
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
        dispatch(fetchDevicesData(token))
        const deviceModel = devdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devdata.devSerial}/adj`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${devdata.devSerial}/adj`, 'on')
        }
        client.publish(`${devdata.devSerial}/adj`, 'on')
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

  const handleSubmitEthernet = async (e: FormEvent) => {
    e.preventDefault()
    const { ipEth, subNetEth, getwayEth, dnsEth } = netConfig
    if (ipEth !== '' && subNetEth !== '' && getwayEth !== '' && dnsEth !== '') {
      try {
        const bodyData = {
          modeEth: "1",
          ipEth: ipEth,
          subNetEth: subNetEth,
          getwayEth: getwayEth,
          dnsEth: dnsEth
        }
        const response = await axios.put<responseType<configType>>(`${import.meta.env.VITE_APP_API}/config/${netConfig.devSerial}`,
          bodyData, {
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
        dispatch(fetchDevicesData(token))
        const deviceModel = devdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devdata.devSerial}/adj`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${devdata.devSerial}/adj`, 'on')
        }
        client.publish(`${devdata.devSerial}/adj`, 'on')
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

  const handleSubmitSim = async (e: FormEvent) => {
    e.preventDefault()
    if (Mode.sim !== '') {
      try {
        const bodyData = {
          sim: Mode.sim
        }
        const response = await axios.put<responseType<configType>>(`${import.meta.env.VITE_APP_API}/config/${netConfig.devSerial}`,
          bodyData, {
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
        dispatch(fetchDevicesData(token))
        const deviceModel = devdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devdata.devSerial}/adj`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${devdata.devSerial}/adj`, 'on')
        }
        client.publish(`${devdata.devSerial}/adj`, 'on')
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

  const handleSubmitEthernetAuto = async (e: FormEvent) => {
    e.preventDefault()
    console.log('auto')
    try {
      const bodyData = {
        modeEth: "0",
      }
      const response = await axios.put<responseType<configType>>(`${import.meta.env.VITE_APP_API}/config/${netConfig.devSerial}`,
        bodyData, {
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
      dispatch(fetchDevicesData(token))
      const deviceModel = devdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
      if (deviceModel === 'eTEMP') {
        client.publish(`siamatic/etemp/v1/${devdata.devSerial}/adj`, 'on')
      } else {
        client.publish(`siamatic/items/v3/${devdata.devSerial}/adj`, 'on')
      }
      client.publish(`${devdata.devSerial}/adj`, 'on')
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

  const setValuestate = (value: string) => {
    setFormdata({ ...formdata, groupId: value })
  }

  const fileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader()
    const fileInput = e.target
    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0]

      // Resize the image before setting the state
      resizeImage(selectedFile)
        .then((resizedFile) => {
          reader.readAsDataURL(resizedFile)
          reader.onload = (event) => {
            let img = event.target?.result
            setDevicePicture(img as string)
          }
          setFormdata({ ...formdata, locationPic: resizedFile })
        })
        .catch((error) => {
          console.error('Error resizing image:', error)
        })
    }
  }

  const fetchFirmware = async () => {
    try {
      const response = await axios.get<responseType<firmwareType[]>>(`${import.meta.env.VITE_APP_API}/firmwares`, {
        headers: { authorization: `Bearer ${token}` }
      })
      setFirmwareList(response.data.data)
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

  useEffect(() => {
    if (!token) return
    fetchFirmware()
    if (devdata.wardId) {
      fetchWard()
    }
  }, [token])

  const versionCompare = (a: FirmwareItem, b: FirmwareItem) => {
    const versionA = a.fileName.match(/(\d+)\.(\d+)\.(\d+)/)
    const versionB = b.fileName.match(/(\d+)\.(\d+)\.(\d+)/)

    if (a.fileName.startsWith('i-TeM') && !b.fileName.startsWith('i-TeM')) return 1
    if (b.fileName.startsWith('i-TeM') && !a.fileName.startsWith('i-TeM')) return -1

    if (versionA && versionB) {
      const majorA = parseInt(versionA[1], 10)
      const minorA = parseInt(versionA[2], 10)
      const patchA = parseInt(versionA[3], 10)

      const majorB = parseInt(versionB[1], 10)
      const minorB = parseInt(versionB[2], 10)
      const patchB = parseInt(versionB[3], 10)

      return (
        majorA - majorB ||
        minorA - minorB ||
        patchA - patchB
      )
    }
    return 0
  }

  const combinedList = firmwareList
    .filter((filter) =>
      !filter.fileName.startsWith('bootloader') &&
      !filter.fileName.startsWith('partition')
    )
    .sort(versionCompare)

  return (
    <div>
      {
        pagestate === "add" ?
          <AddDevices onClick={openmodal}>
            {t('addDeviceButton')}
            <RiAddLine />
          </AddDevices>
          :
          <AddDevices onClick={openmodal} $primary>
            <RiEditLine size={16} />
          </AddDevices>
      }
      <Modal
        size={pagestate === "edit" ? "lg" : undefined}
        show={show}
        onHide={closemodal}>
        <Modal.Header>
          {/* <pre>
            {JSON.stringify(formdata, null, 2)}
          </pre> */}
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addDeviceButton')
                  :
                  t('editDeviceButton')
              }
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitEdit}>
          <Modal.Body>
            <Row>
              {
                pagestate !== "add" ?
                  <>
                    {
                      userLevel !== '2' && userLevel !== '3' && <Col lg={6}>
                        <InputGroup className="mb-3">
                          <Form.Label className="w-100">
                            {t('hospitals')}
                            <HospitalDropdown
                              setHos_id={setHosid}
                              Hosid={hosid}
                              key={hosid}
                            />
                          </Form.Label>
                        </InputGroup>
                      </Col>
                    }
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className="w-100">
                          {t('ward')}
                          <WardDropdown
                            setStateWard={setValuestate}
                            Hosid={hosid}
                            groupId={String(devdata?.wardId)}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                  </>
                  :
                  <></>
              }
              <Col lg={pagestate === "edit" ? 6 : 12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('deviceSerialTb')}
                    <Form.Control
                      name='form_label_hosname'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      disabled={pagestate === 'edit'}
                      value={formdata.devSn}
                      onChange={(e) => setFormdata({ ...formdata, devSn: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              {
                pagestate === "add" &&
                <Col lg={pagestate === "add" ? 12 : 6}>
                  <InputGroup className="mb-3">
                    <Form.Label className="w-100">
                      {t('deviceMacAddress')}
                      <Form.Control
                        name='form_label_hosname'
                        spellCheck={false}
                        autoComplete='off'
                        type='text'
                        value={formdata.macAddWiFi}
                        onChange={(e) => setFormdata({ ...formdata, macAddWiFi: e.target.value })}
                      />
                    </Form.Label>
                  </InputGroup>
                </Col>
              }
              {
                pagestate === "edit" ?
                  <>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className="w-100">
                          {t('deviceNameTb')}
                          <Form.Control
                            name='form_label_hosname'
                            spellCheck={false}
                            autoComplete='off'
                            type='text'
                            value={formdata.devName}
                            onChange={(e) => setFormdata({ ...formdata, devName: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className="w-100">
                          {t('deviceZone')}
                          <Form.Control
                            name='form_label_hosname'
                            spellCheck={false}
                            autoComplete='off'
                            type='text'
                            value={formdata.devZone}
                            onChange={(e) => setFormdata({ ...formdata, devZone: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className="w-100">
                          {t('deviceLocationTb')}
                          <Form.Control
                            name='form_label_hosname'
                            spellCheck={false}
                            autoComplete='off'
                            type='text'
                            value={formdata.devLocation}
                            onChange={(e) => setFormdata({ ...formdata, devLocation: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className="w-auto">
                          {t('devicePicture')}
                          <ProfileFlex $radius={10} $dimension={250}>
                            <div>
                              <img src={devicePicture ? devicePicture : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="down-picture" />
                              <label htmlFor={'user-file-upload'} >
                                <RiEditLine />
                                <input id="user-file-upload" type="file" accept="image/gif, image/jpg, image/jpeg, image/png" onChange={fileSelected} />
                              </label>
                            </div>
                          </ProfileFlex>
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    {
                      userLevel !== '2' && userLevel !== '3' && <Col lg={6}>
                        <Row>
                          <InputGroup className="mb-3">
                            <Form.Label className="w-100">
                              {t('deviceNetwork')}
                              <ManageConfigAdd type='button' onClick={openmodalConfig} className="mt-3">
                                {t('deviceNetwork')}
                                <RiListSettingsLine />
                              </ManageConfigAdd>
                            </Form.Label>
                          </InputGroup>
                        </Row>
                        {
                          userLevel === '0' && <Row>
                            <InputGroup className="mb-3">
                              <Form.Label className="w-100">
                                {t('sendOTA')}
                                <SendOTAtoBoard>
                                  <Form.Select onChange={(e) => setFirmwareName(e.target.value)} value={firmwareName}>
                                    <option key={'select-option'} value="">{t('selectOTA')}</option>
                                    {combinedList.map((items, index) => (
                                      <option key={index} value={items.fileName}>
                                        {items.fileName.startsWith('eTEMP') ? 'eTEMP: ' : 'i-TeM: '}{items.fileName}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <UploadButton type='button' disabled={firmwareName === ''} onClick={() => {
                                    const deviceModel = devdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
                                    if (deviceModel === 'eTEMP') {
                                      client.publish(`siamatic/etemp/v1/${devdata.devSerial}/firmware`, firmwareName)
                                    } else {
                                      client.publish(`siamatic/items/v3/${devdata.devSerial}/firmware`, firmwareName)
                                    }
                                    client.publish(`${devdata.devSerial}/firmware`, firmwareName)
                                  }}>
                                    <RiMessage3Line size={24} />
                                    {t('updateButton')}
                                  </UploadButton>
                                </SendOTAtoBoard>
                              </Form.Label>
                            </InputGroup>
                          </Row>
                        }
                        {
                          userLevel === '0' && <Row>
                            <Row>
                              <span className='mb-2'>{t('hardReset')}</span>
                            </Row>
                            <Col>
                              <InputGroup className="mb-3">
                                <Form.Label className="w-100">
                                  {t('resetHour')}
                                  <Select
                                    id="hours"
                                    options={mapOptions<selectOption, keyof selectOption>(hoursOptions, 'value', 'label')}
                                    value={mapDefaultValue<selectOption, keyof selectOption>(hoursOptions, String(resetHour), 'value', 'label')}
                                    onChange={(e) => setResetTime({ ...resetTime, resetHour: e?.value })}
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
                            <Col>
                              <InputGroup className="mb-3">
                                <Form.Label className="w-100">
                                  {t('resetMinute')}
                                  <Select
                                    id="minutes"
                                    options={mapOptions<selectOption, keyof selectOption>(minutesOptions, 'value', 'label')}
                                    value={mapDefaultValue<selectOption, keyof selectOption>(minutesOptions, String(resetMinute), 'value', 'label')}
                                    onChange={(e) => setResetTime({ ...resetTime, resetMinute: e?.value })}
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
                          </Row>
                        }
                      </Col>
                    }
                  </>
                  :
                  <></>
              }
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('submitButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal size={"lg"} show={showConfig} onHide={closemodalConfig}>
        <Modal.Header>
          <ModalHead>
            <ModalMuteHead onClick={closemodalConfig}>
              <button>
                <RiArrowLeftSLine />
              </button>
              <span>
                {t('deviceNetwork')}
              </span>
            </ModalMuteHead>
            {/* <pre>{JSON.stringify(netConfig, null, 2)}</pre> */}
          </ModalHead>
        </Modal.Header>
        <TabContainer>
          <TabButton $primary={tabs === 1} onClick={() => setTabs(1)}>Wi-Fi</TabButton>
          <TabButton $primary={tabs === 2} onClick={() => setTabs(2)}>Lan</TabButton>
          <TabButton $primary={tabs === 3} onClick={() => setTabs(3)}>SIM</TabButton>
        </TabContainer>
        <Form
          onSubmit={tabs === 1 && Mode.wifi === 0 ? handleSubmitDHCP : tabs === 1 && Mode.wifi === 1 ? handleSubmitManual : tabs === 2 && Mode.lan === 0 ? handleSubmitEthernet : tabs === 2 && Mode.lan === 1 ? handleSubmitEthernetAuto : handleSubmitSim}>
          <Modal.Body>
            <Row>
              <Col lg={12} className='mb-3'>
                <ModeNetworkFlex>
                  {
                    tabs === 1 ?
                      <>
                        <Form.Check
                          type='radio'
                          label='DHCP'
                          checked={Mode.wifi === 0}
                          onChange={() => setMode({ ...Mode, wifi: 0 })}
                        />
                        <Form.Check
                          type='radio'
                          label='Manual'
                          checked={Mode.wifi === 1}
                          onChange={() => setMode({ ...Mode, wifi: 1 })}
                        />
                      </>
                      :
                      tabs === 2 ?
                        <>
                          <Form.Check
                            type='radio'
                            label='Ethernet'
                            checked={Mode.lan === 0}
                            onChange={() => setMode({ ...Mode, lan: 0 })}
                          />
                          <Form.Check
                            type='radio'
                            label='Auto'
                            checked={Mode.lan === 1}
                            onChange={() => setMode({ ...Mode, lan: 1 })}
                          />
                        </>
                        :
                        <>
                          <Form.Check
                            type='radio'
                            label='AIS'
                            checked={Mode.sim === 'AIS'}
                            onChange={() => setMode({ ...Mode, sim: 'AIS' })}
                          />
                          <Form.Check
                            type='radio'
                            label='TRUE'
                            checked={Mode.sim === 'TRUE'}
                            onChange={() => setMode({ ...Mode, sim: 'TRUE' })}
                          />
                          <Form.Check
                            type='radio'
                            label='DTAC'
                            checked={Mode.sim === 'DTAC'}
                            onChange={() => setMode({ ...Mode, sim: 'DTAC' })}
                          />
                        </>
                  }
                </ModeNetworkFlex>
              </Col>
              {
                tabs === 1 && Mode.wifi === 0 ?
                  <Row key={Mode.wifi}>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className='w-100'>
                          SSID
                          <Form.Control
                            type='text'
                            id='SSID'
                            value={netConfig.SSID}
                            onChange={(e) => setNetConfig({ ...netConfig, SSID: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={6}>
                      <InputGroup className="mb-3">
                        <Form.Label className='w-100'>
                          Password
                          <Form.Control
                            type='Password'
                            id='Password'
                            value={netConfig.Password}
                            onChange={(e) => setNetConfig({ ...netConfig, Password: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={12}>
                      <InputGroup className="mb-3">
                        <Form.Label className='w-100'>
                          MacAddress
                          <Form.Control
                            type='text'
                            id='MacAddress'
                            value={netConfig.MacAddress}
                            placeholder='ไม่บังคับ'
                            onChange={(e) => setNetConfig({ ...netConfig, MacAddress: e.target.value })}
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                  </Row>
                  :
                  tabs === 1 && Mode.wifi === 1 ?
                    <Row key={Mode.wifi}>
                      <Col lg={6}>
                        <InputGroup className="mb-3">
                          <Form.Label className='w-100'>
                            IP
                            <Form.Control
                              type='text'
                              id='IP'
                              value={netConfig.IP}
                              onChange={(e) => setNetConfig({ ...netConfig, IP: e.target.value })}
                            />
                          </Form.Label>
                        </InputGroup>
                      </Col>
                      <Col lg={6}>
                        <InputGroup className="mb-3">
                          <Form.Label className='w-100'>
                            Subnet
                            <Form.Control
                              type='text'
                              id='Subnet'
                              value={netConfig.Subnet}
                              onChange={(e) => setNetConfig({ ...netConfig, Subnet: e.target.value })}
                            />
                          </Form.Label>
                        </InputGroup>
                      </Col>
                      <Col lg={6}>
                        <InputGroup className="mb-3">
                          <Form.Label className='w-100'>
                            Getway
                            <Form.Control
                              type='text'
                              id='Gateway'
                              value={netConfig.Gateway}
                              onChange={(e) => setNetConfig({ ...netConfig, Gateway: e.target.value })}
                            />
                          </Form.Label>
                        </InputGroup>
                      </Col>
                      <Col lg={6}>
                        <InputGroup className="mb-3">
                          <Form.Label className='w-100'>
                            DNS
                            <Form.Control
                              type='text'
                              id='DNS'
                              value={netConfig.DNS}
                              onChange={(e) => setNetConfig({ ...netConfig, DNS: e.target.value })}
                            />
                          </Form.Label>
                        </InputGroup>
                      </Col>
                    </Row>
                    :
                    tabs === 2 && Mode.lan === 0 ?
                      <Row>
                        <Col lg={6}>
                          <InputGroup className="mb-3">
                            <Form.Label className='w-100'>
                              IP
                              <Form.Control
                                type='text'
                                id='Ip Ethernet'
                                value={netConfig.ipEth}
                                onChange={(e) => setNetConfig({ ...netConfig, ipEth: e.target.value })}
                              />
                            </Form.Label>
                          </InputGroup>
                        </Col>
                        <Col lg={6}>
                          <InputGroup className="mb-3">
                            <Form.Label className='w-100'>
                              Subnet
                              <Form.Control
                                type='text'
                                id='SubNet Ethernet'
                                value={netConfig.subNetEth}
                                onChange={(e) => setNetConfig({ ...netConfig, subNetEth: e.target.value })}
                              />
                            </Form.Label>
                          </InputGroup>
                        </Col>
                        <Col lg={6}>
                          <InputGroup className="mb-3">
                            <Form.Label className='w-100'>
                              Getway
                              <Form.Control
                                type='text'
                                id='Getway Ethernet'
                                value={netConfig.getwayEth}
                                onChange={(e) => setNetConfig({ ...netConfig, getwayEth: e.target.value })}
                              />
                            </Form.Label>
                          </InputGroup>
                        </Col>
                        <Col lg={6}>
                          <InputGroup className="mb-3">
                            <Form.Label className='w-100'>
                              DNS
                              <Form.Control
                                type='text'
                                id='DNS Ethernet'
                                value={netConfig.dnsEth}
                                onChange={(e) => setNetConfig({ ...netConfig, dnsEth: e.target.value })}
                              />
                            </Form.Label>
                          </InputGroup>
                        </Col>
                      </Row>
                      :
                      <></>
              }
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('submitButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </div >
  )
}
