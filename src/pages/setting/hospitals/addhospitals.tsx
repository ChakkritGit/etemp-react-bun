import { ChangeEvent, FormEvent, useState } from 'react'
import { FormBtn, FormFlexBtn, ManageHospitalsAdd, ModalHead, ProfileFlex } from '../../../style/style'
import { RiAddLine, RiCloseLine, RiEditLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { Col, Modal, Row, Form, InputGroup } from 'react-bootstrap'
import Swal from 'sweetalert2'
import axios, { AxiosError } from 'axios'
import { addHospitalProp } from '../../../types/prop.type'
import { useDispatch } from 'react-redux'
import { storeDispatchType } from '../../../stores/store'
import { useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../../../types/redux.type'
import { fetchHospitals } from '../../../stores/dataArraySlices'
import { responseType } from '../../../types/response.type'
import { hospitalsType } from '../../../types/hospital.type'
import { setShowAlert } from '../../../stores/utilsStateSlice'
import { resizeImage } from '../../../constants/constants'

export default function Addhospitals(addhosprop: addHospitalProp) {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const { pagestate, hosdata } = addhosprop
  const dispatch = useDispatch<storeDispatchType>()
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [formdata, setFormdata] = useState({
    name: pagestate !== "add" ? hosdata?.hosName as string : '',
    address: pagestate !== "add" ? hosdata?.hosAddress as string : '',
    telephone: pagestate !== "add" ? hosdata?.hosTelephone as string : '',
    picture: null as File | null,
  })
  const [hosPicture, setHosPicture] = useState<string>(hosdata?.hosPic ? `${import.meta.env.VITE_APP_IMG}${hosdata?.hosPic}` : '')

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    setShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/hospital`
    const formData = new FormData()
    formData.append('hosName', String(formdata.name))
    formData.append('hosAddress', String(formdata.address))
    formData.append('userTelePhone', String(formdata.telephone))
    if (formdata.picture) {
      formData.append('fileupload', formdata.picture as File)
    }
    if (formdata.name !== "" && formdata.address !== "" && formdata.telephone !== "") {
      try {
        const response = await axios.post<responseType<hospitalsType>>(url, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`
          }
        })
        setShow(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        setFormdata({
          name: '',
          address: '',
          telephone: '',
          picture: null as File | null,
        })
        dispatch(fetchHospitals(token))
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
    const url: string = `${import.meta.env.VITE_APP_API}/hospital/${hosdata?.hosId}`
    const formData = new FormData()
    formData.append('hosName', String(formdata.name))
    formData.append('hosAddress', String(formdata.address))
    formData.append('hosTelephone', String(formdata.telephone))
    if (formdata.picture) {
      formData.append('fileupload', formdata.picture as File)
    }
    if (formdata.name !== "" && formdata.address !== "" && formdata.telephone !== "") {
      try {
        const response = await axios.put<responseType<hospitalsType>>(url, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`
          }
        })
        setShow(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        dispatch(fetchHospitals(token))
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
        title: t('alert_header_Warning'),
        text: t('completeField'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const fileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader()
    const fileInput = e.target
    if (e.target && fileInput.files && e.target.files && e.target.files.length > 0) {
      const selectedFile = fileInput.files[0]

      // Resize the image before setting the state
      resizeImage(selectedFile)
        .then((resizedFile) => {
          reader.readAsDataURL(resizedFile)
          reader.onload = (event) => {
            let img = event.target?.result
            setHosPicture(img as string)
          }
          setFormdata({ ...formdata, picture: resizedFile })
        })
        .catch((error) => {
          console.error('Error resizing image:', error)
        })
    }
  }

  return (
    <>
      {
        pagestate == 'add' ?
          <ManageHospitalsAdd onClick={openmodal}>
            {t('addHos')}
            <RiAddLine />
          </ManageHospitalsAdd>
          :
          <ManageHospitalsAdd onClick={openmodal} $primary>
            <RiEditLine size={16} />
          </ManageHospitalsAdd>
      }
      <Modal size='lg' show={show} onHide={closemodal}>
        <Modal.Header>
          {/* {JSON.stringify(formdata)} */}
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addHos')
                  :
                  t('editHos')
              }
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitedit}>
          <Modal.Body>
            <Row>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('hosName')}
                    <Form.Control
                      name='form_label_hosname'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.name}
                      onChange={(e) => setFormdata({ ...formdata, name: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('hosAddress')}
                    <Form.Control
                      name='form_label_hosaddress'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.address}
                      onChange={(e) => setFormdata({ ...formdata, address: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('hosTel')}
                    <Form.Control
                      name='form_label_hostel'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.telephone}
                      onChange={(e) => setFormdata({ ...formdata, telephone: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('hosPicture')}
                    <ProfileFlex $radius={10} $dimension={250}>
                      <div>
                        <img src={hosPicture ? hosPicture : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`} alt="down-picture" />
                        <label htmlFor={'user-file-upload'} >
                          <RiEditLine />
                          <input id="user-file-upload" type="file" accept="image/gif, image/jpg, image/jpeg, image/png" onChange={fileSelect} />
                        </label>
                      </div>
                    </ProfileFlex>
                  </Form.Label>
                </InputGroup>
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
      </Modal>
    </>
  )
}
