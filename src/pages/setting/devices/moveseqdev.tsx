import { RiCloseLine, RiDragMove2Fill } from 'react-icons/ri'
import { BeforeSeq, OpenModalButton } from '../../../style/components/manage.dev'
import { devicesType } from '../../../types/device.type'
import { FormEvent, useState } from 'react'
import { Col, Form, InputGroup, Modal, Row } from 'react-bootstrap'
import { FormBtn, FormFlexBtn, ModalHead } from '../../../style/style'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DeviceState, DeviceStateStore, UtilsStateStore } from '../../../types/redux.type'
import Swal from 'sweetalert2'
import axios, { AxiosError } from 'axios'
import { setShowAlert } from '../../../stores/utilsStateSlice'
import { storeDispatchType } from '../../../stores/store'
import { fetchDevicesData } from '../../../stores/devicesSlices'
import { useTheme } from '../../../theme/ThemeProvider'
import Select, { SingleValue } from 'react-select'

type moveSeqType = {
  devData: devicesType
}

type Option = {
  value: string,
  label: string,
}

type Seq = {
  devSerial: string,
  devId: string,
  devSeq: number
}

export default function Moveseqdev({ devData }: moveSeqType) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const { devId, devSeq, devSerial } = devData
  const [show, setShow] = useState(false)
  const { theme } = useTheme()
  const [selectDev, setSelectDev] = useState({
    devSerial: '- -',
    devId: '',
    devSeq: 0
  })

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (devId !== '' && devSeq !== 0 && selectDev.devId !== '' && selectDev.devSeq !== 0) {
      try {
        const response = await axios.patch(`${import.meta.env.VITE_APP_API}/device/${devId}/${selectDev.devId}`,
          {
            devSeq: devSeq,
            afterDevSeq: selectDev.devSeq
          },
          {
            headers: { authorization: `Bearer ${token}` }
          })
        dispatch(fetchDevicesData(token))
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

  const setNewSeq = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    const selectData: devicesType = JSON.parse(selectedValue)
    const { devId, devSeq, devSerial } = selectData
    setSelectDev({ devSerial: devSerial, devId: devId, devSeq: devSeq })
  }

  const mapOptions = <T, K extends keyof T>(data: T[], valueKey: K, valueKey2: K, labelKey: K): Option[] =>
    data.map(item => ({
      value: JSON.stringify({
        devSerial: item[labelKey],
        devId: item[valueKey],
        devSeq: item[valueKey2]
      }) as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, valueKey2: K, labelKey: K): Option | undefined =>
    data.filter(item => item[valueKey] === id).map(item => ({
      value: JSON.stringify({
        devSerial: item[labelKey],
        devId: item[valueKey],
        devSeq: item[valueKey2]
      }) as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

  return (
    <>
      <OpenModalButton onClick={openModal}>
        <RiDragMove2Fill size={16} />
      </OpenModalButton>

      <Modal
        size={"lg"}
        show={show}
        onHide={closeModal}>
        <Modal.Header>
          {/* <pre>
            {JSON.stringify(formdata, null, 2)}
          </pre> */}
          <ModalHead>
            <strong>
              move
            </strong>
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100 text-center">
                    <b>{t('sourceSeq')}</b>
                    <BeforeSeq>
                      <div>
                        <span>{t('deviceSerialTb')}</span>
                        <span>{devSerial}</span>
                      </div>
                      <div>
                        <span>{devSeq}</span>
                        <span>{t('deviceSeq')}</span>
                      </div>
                    </BeforeSeq>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100 text-center">
                    <b>{t('destSeq')}</b>
                    <BeforeSeq>
                      <div>
                        <span>{t('deviceSerialTb')}</span>
                        <span>{selectDev.devSerial}</span>
                      </div>
                      <div>
                        <span>{selectDev.devSeq}</span>
                        <span>{t('deviceSeq')}</span>
                      </div>
                    </BeforeSeq>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('deviceSerialTb')}
                    <Select
                      options={mapOptions<Seq, keyof Seq>(devices.filter((f) => f.devId !== devId), 'devId', 'devSeq', 'devSerial')}
                      value={mapDefaultValue<Seq, keyof Seq>(devices.filter((f) => f.devId !== devId), JSON.stringify(selectDev), 'devId', 'devSeq', 'devSerial')}
                      onChange={setNewSeq}
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
    </>
  )
}
