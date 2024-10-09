import { FormEvent, useState } from 'react'
import {
  AddrepairBtn, Checkboxbsoveride, FormBtn, FormFlexBtn,
  FormTitleFlex, ModalHead
} from '../../style/style'
import {
  RiAddLine, RiCloseLine, RiDropboxLine, RiEditLine,
  RiInformationLine, RiUser3Line
} from 'react-icons/ri'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import WardDropdown from '../../components/dropdown/wardDropdown'
import Showsn from './showsn'
import { repairType } from '../../types/repair.type'
import axios, { AxiosError } from 'axios'
import Swal from 'sweetalert2'
import { responseType } from '../../types/response.type'
import { useDispatch, useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../../types/redux.type'
import { setRefetchdata, setShowAlert } from '../../stores/utilsStateSlice'
import { storeDispatchType } from '../../stores/store'

type addrepairtype = {
  pagestate: string,
  fetchdata: () => void,
  devdata: repairType
}

export default function Addrepair(addrepair: addrepairtype) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { devdata, fetchdata, pagestate } = addrepair
  const { cookieDecode, reFetchData } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token, displayName, hosId, groupId } = cookieDecode
  const [show, setShow] = useState(false)
  const [repairData, setRepairdata] = useState({
    repairInfo: devdata.repairInfo || displayName,
    repairLocation: devdata.repairLocation || '',
    telePhone: devdata.telePhone || '',
    ward: devdata.ward || '',
    devId: devdata.devId || '',
    warrantyStatus: devdata.warrantyStatus || '',
    comment: devdata.comment || '',
    repairDetails: devdata.repairDetails || '',
    repairStatus: '1',
    repairInfo1: devdata.repairInfo1 || '',
    repairInfo2: devdata.repairInfo2 || ''
  })

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    setShow(false)
  }

  const setValuestate = (value: string) => {
    setRepairdata({ ...repairData, ward: value })
  }

  const handleCheckboxChange = (value: string) => {
    setRepairdata({ ...repairData, warrantyStatus: value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const { devId, repairDetails, repairInfo, repairInfo1, repairInfo2, repairLocation, repairStatus, telePhone, ward, warrantyStatus } = repairData
    if (repairInfo !== '' && repairLocation !== '' && telePhone !== '' && ward !== '' && devId !== '' && warrantyStatus !== ''
      && repairDetails !== '' && repairStatus !== '' && repairInfo1 !== '' && repairInfo2 !== ''
    ) {
      try {
        const response = await axios
          .post<responseType<repairType>>(`${import.meta.env.VITE_APP_API}/repair`, repairData, {
            headers: { authorization: `Bearer ${token}` }
          })
        setShow(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        fetchdata()
        setRepairdata({
          repairInfo: '',
          repairLocation: '',
          telePhone: '',
          ward: '',
          devId: '',
          warrantyStatus: '',
          comment: '',
          repairDetails: '',
          repairStatus: '',
          repairInfo1: '',
          repairInfo2: ''
        })
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

  const handleSubmitEdit = async (e: FormEvent) => {
    e.preventDefault()
    const { devId, repairDetails, repairInfo, repairInfo1, repairInfo2, repairLocation, repairStatus, telePhone, ward, warrantyStatus } = repairData
    if (repairInfo !== '' && repairLocation !== '' && telePhone !== '' && ward !== '' && devId !== '' && warrantyStatus !== ''
      && repairDetails !== '' && repairStatus !== '' && repairInfo1 !== '' && repairInfo2 !== ''
    ) {
      try {
        const response = await axios
          .put<responseType<repairType>>(`${import.meta.env.VITE_APP_API}/repair/${devdata.repairId}`, repairData, {
            headers: { authorization: `Bearer ${token}` }
          })
        setShow(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        fetchdata()
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

  return (
    <>
      {
        pagestate === "add" ?
          <AddrepairBtn onClick={openmodal}>
            {t('addRepair')}
            <RiAddLine />
          </AddrepairBtn>
          :
          <AddrepairBtn onClick={openmodal} $primary>
            <RiEditLine size={16} />
          </AddrepairBtn>
      }

      <Modal
        size={pagestate === "edit" ? "lg" : 'lg'}
        show={show}
        onHide={closemodal}>
        <Modal.Header>
          {/* <pre>
            {JSON.stringify(repairData, null, 2)}
          </pre> */}
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addRepair')
                  :
                  t('editRepair')
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
              <Col lg={6}>
                <FormTitleFlex><RiUser3Line />{t('sectionPersonal')}</FormTitleFlex>
                <Form.Group className="mb-3" >
                  <Form.Label>{t('hisUsername')}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    autoComplete='off'
                    value={repairData.repairInfo}
                    onChange={(e) => setRepairdata({ ...repairData, repairInfo: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>{t('hosAddress')}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    autoComplete='off'
                    value={repairData.repairLocation}
                    onChange={(e) => setRepairdata({ ...repairData, repairLocation: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>{t('hosTel')}</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder=""
                    autoComplete='off'
                    value={repairData.telePhone}
                    onChange={(e) => setRepairdata({ ...repairData, telePhone: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>{t('ward')}</Form.Label>
                  <WardDropdown
                    setStateWard={setValuestate}
                    Hosid={hosId}
                    groupId={groupId}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <FormTitleFlex><RiDropboxLine />{t('sectionProduct')}</FormTitleFlex>
                <Form.Group className="mb-3" >
                  <Form.Label>{t('deviceSerialTb')}</Form.Label>
                  <Showsn
                    repairData={repairData}
                    setRepairdata={setRepairdata}
                    devIdkey={devdata.devId}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Checkboxbsoveride>
                    <Form.Check
                      inline
                      label={t('tabWarrantyExpired')}
                      className='int-ch-b'
                      type="checkbox"
                      checked={repairData.warrantyStatus === "2"}
                      onChange={() => handleCheckboxChange("2")}
                    />
                    <Form.Check
                      inline
                      label={t('tabWarrantyAfterSale')}
                      className='int-ch-b'
                      type="checkbox"
                      checked={repairData.warrantyStatus === "1"}
                      onChange={() => handleCheckboxChange("1")}
                    />
                    <Form.Check
                      inline
                      label={t('warrantyMa')}
                      className='int-ch-b'
                      type="checkbox"
                      checked={repairData.warrantyStatus === "3"}
                      onChange={() => handleCheckboxChange("3")}
                    />
                    <Form.Check
                      inline
                      label={t('warrantyEtc')}
                      className='int-ch-b'
                      type="checkbox"
                      checked={repairData.warrantyStatus === "4"}
                      onChange={() => handleCheckboxChange("4")}
                    />
                  </Checkboxbsoveride>
                </Form.Group>
                {repairData.warrantyStatus === "4" ?
                  <Form.Group className="mb-3" >
                    <Form.Label>{t('hisDetail')}</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder=""
                      autoComplete='off'
                      rows={6}
                      value={repairData.comment}
                      onChange={(e) => setRepairdata({ ...repairData, comment: e.target.value })}
                    />
                  </Form.Group>
                  :
                  ""
                }
              </Col>
              <Col lg={16}>
                <Row>
                  <FormTitleFlex><RiInformationLine />{t('deviceDetail')}</FormTitleFlex>
                  <Form.Group className="mb-3 w-100" >
                    <Form.Label>{t('hisDetail')}</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder=""
                      autoComplete='off'
                      rows={6}
                      value={repairData.repairDetails}
                      onChange={(e) => setRepairdata({ ...repairData, repairDetails: e.target.value })} />
                  </Form.Group>
                  <Col lg={6}>
                    <Form.Group className="mb-3" >
                      <Form.Label>{t('deviceCondition')}</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder=""
                        autoComplete='off'
                        value={repairData.repairInfo1}
                        onChange={(e) => setRepairdata({ ...repairData, repairInfo1: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" >
                      <Form.Label>{t('deviceRepairInfo')}</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder=""
                        autoComplete='off'
                        value={repairData.repairInfo2}
                        onChange={(e) => setRepairdata({ ...repairData, repairInfo2: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
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
      </Modal >
    </>
  )
}
