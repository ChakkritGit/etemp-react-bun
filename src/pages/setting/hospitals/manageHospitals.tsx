import {
  Actiontablehos, DelUserButton, FormBtn, FormFlexBtn, HosTableImage, ManageHospitalsBody, ManageHospitalsContainer,
  ManageHospitalsHeader, ManageHospitalsHeaderAction, ManageWardAdd, ModalHead, SubWardColumnFlex
} from "../../../style/style"
import { useTranslation } from "react-i18next"
import { hospitalsType } from "../../../types/hospital.type"
import { swalWithBootstrapButtons } from "../../../components/dropdown/sweetalertLib"
import { RiAddLine, RiCloseLine, RiDeleteBin2Line, RiEditLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { DataArrayStore, DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { useDispatch } from "react-redux"
import { storeDispatchType } from "../../../stores/store"
import { fetchHospitals } from "../../../stores/dataArraySlices"
import { wardsType } from "../../../types/ward.type"
import { responseType } from "../../../types/response.type"
import axios, { AxiosError } from "axios"
import DataTable, { TableColumn } from "react-data-table-component"
import Addhospitals from "./addhospitals"
import Swal from "sweetalert2"
import { setSearchQuery, setShowAlert } from "../../../stores/utilsStateSlice"
import { FormEvent, memo, useEffect, useState } from "react"
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import HospitalDropdown from "../../../components/dropdown/hospitalDropdown"

export default function ManageHospitals() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery, cookieDecode, tokenDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const { hospital } = useSelector<DeviceStateStore, DataArrayStore>((state) => state.arraySlice)
  const { hospitalsData } = hospital
  const { userLevel } = tokenDecode
  const [addwardprop, setAddwardprop] = useState<{ pagestate: string, warddata: wardsType | undefined }>({
    pagestate: 'add',
    warddata: undefined
  })
  const [formdata, setFormdata] = useState('')

  const [show, setShow] = useState(false)
  const [hosid, setHosid] = useState('')
  const { pagestate, warddata } = addwardprop

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const deletehospital = async (hID: string) => {
    const url: string = `${import.meta.env.VITE_APP_API}/hospital/${hID}`
    try {
      const response = await axios
        .delete<responseType<hospitalsType>>(url, {
          headers: { authorization: `Bearer ${token}` }
        })
      dispatch(fetchHospitals(token))
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

  const deleteward = async (wID: string) => {
    const url: string = `${import.meta.env.VITE_APP_API}/ward/${wID}`
    try {
      const response = await axios
        .delete<responseType<wardsType>>(url, {
          headers: { authorization: `Bearer ${token}` }
        })
      dispatch(fetchHospitals(token))
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

  const columns: TableColumn<hospitalsType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
    },
    {
      name: t('hosPicture'),
      cell: (item) => (
        <div>
          <HosTableImage
            src={item.hosPic ? `${import.meta.env.VITE_APP_IMG}${item.hosPic}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`}
            alt="hos-logo" />
        </div>
      ),
      center: true,
      sortable: false,
    },
    {
      name: t('hosName'),
      cell: (item) => item.hosName,
      center: true,
      sortable: false,
    },
    {
      name: t('hosAddress'),
      cell: (item) => item.hosAddress,
      center: true,
      sortable: false,
    },
    {
      name: t('hosTel'),
      cell: (item) => item.hosTelephone,
      center: true,
      sortable: false,
    },
    {
      name: t('action'),
      cell: (item, index) =>
        <Actiontablehos key={index}>
          <Addhospitals
            pagestate={'edit'}
            hosdata={{
              hosId: item.hosId,
              hosName: item.hosName,
              hosTelephone: item.hosTelephone,
              hosAddress: item.hosAddress,
              hosPic: item.hosPic
            }}
            key={item.hosId}
          />
          {
            item.hosId !== "HID-DEVELOPMENT" && userLevel !== '2' && userLevel !== '3' && <DelUserButton onClick={() =>
              swalWithBootstrapButtons
                .fire({
                  title: t('deleteHosTitle'),
                  text: t('notReverseText'),
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: t('confirmButton'),
                  cancelButtonText: t('cancelButton'),
                  reverseButtons: false,
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    deletehospital(item.hosId)
                  }
                })}>
              <RiDeleteBin2Line size={16} />
            </DelUserButton>
          }
        </Actiontablehos>,
      center: true,
      sortable: false,
    },
  ]

  const subWardColumns: TableColumn<wardsType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
    },
    {
      name: t('wardName'),
      cell: (item) => item.wardName,
      center: true,
      sortable: false,
    },
    {
      name: t('action'),
      cell: (item, index) => (
        <Actiontablehos key={index}>
          <ManageWardAdd onClick={() => { openmodal(); setAddwardprop({ ...addwardprop, pagestate: 'edit', warddata: item }) }} $primary >
            <RiEditLine size={16} />
          </ManageWardAdd>
          {item.hosId !== "HID-DEVELOPMENT" && (
            <DelUserButton onClick={() =>
              swalWithBootstrapButtons
                .fire({
                  title: t('deleteWardTitle'),
                  text: t('notReverseText'),
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: t('confirmButton'),
                  cancelButtonText: t('cancelButton'),
                  reverseButtons: false,
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    deleteward(item.wardId)
                  }
                })
            }>
              <RiDeleteBin2Line size={16} />
            </DelUserButton>
          )}
        </Actiontablehos>
      ),
      center: true,
      sortable: false,
    },
  ]

  const ExpandedComponent = memo(({ data }: { data: hospitalsType }) => (
    <SubWardColumnFlex>
      <DataTable
        columns={subWardColumns}
        data={data.ward}
        responsive
      />
    </SubWardColumnFlex>
  ))

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    setShow(false)
    setAddwardprop({ pagestate: 'add', warddata: undefined })
    setFormdata('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/ward`
    if (hosid !== '' && formdata !== '') {
      try {
        const response = await axios.post<responseType<wardsType>>(url, {
          hosId: String(hosid),
          wardName: String(formdata)
        }, {
          headers: {
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
        setAddwardprop({
          ...addwardprop, warddata: undefined
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
    const url: string = `${import.meta.env.VITE_APP_API}/ward/${addwardprop?.warddata?.wardId}`

    if (formdata !== '') {
      try {
        const response = await axios.put<responseType<wardsType>>(url, {
          wardName: String(formdata)
        }, {
          headers: {
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
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  useEffect(() => {
    console.log(pagestate)
  }, [pagestate])

  // Filter Data
  const filteredItems = hospitalsData.filter(item => item.hosName.toLowerCase().includes(searchQuery.toLowerCase())
    || item.hosTelephone.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <ManageHospitalsContainer>
      <ManageHospitalsHeader className="mb-3">
        <h3>{t('titleManageHosandWard')}</h3>
        <ManageHospitalsHeaderAction>
          {
            userLevel !== "3" && userLevel !== "2" &&
            <Addhospitals
              pagestate={'add'}
            />
          }
          <ManageWardAdd onClick={() => { openmodal(); setAddwardprop({ ...addwardprop, pagestate: 'add' }) }}>
            {t('addWard')}
            <RiAddLine />
          </ManageWardAdd>
        </ManageHospitalsHeaderAction>
      </ManageHospitalsHeader>
      <ManageHospitalsBody>
        <DataTable
          columns={columns}
          data={filteredItems}
          expandableRows
          expandOnRowClicked
          expandableRowsComponent={ExpandedComponent}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
          pagination
          responsive
          fixedHeader
          fixedHeaderScrollHeight="calc(100dvh - 350px)"
        />
      </ManageHospitalsBody>

      <Modal show={show} onHide={closemodal}>
        <Modal.Header>
          {/* {JSON.stringify(formdata)} */}
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addWard')
                  :
                  t('editWard')
              }
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === 'add' ? handleSubmit : handleSubmitedit}>
          <Modal.Body>
            <Row>
              {
                pagestate === 'add' ?
                  <Col lg={6}>
                    <InputGroup className="mb-3">
                      <Form.Label className="w-100">
                        {t('userHospitals')}
                        <HospitalDropdown
                          setHos_id={setHosid}
                        />
                      </Form.Label>
                    </InputGroup>
                  </Col>
                  :
                  <></>
              }
              <Col lg={pagestate === 'edit' ? 12 : 6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('wardName')}
                    <Form.Control
                      name="form_ward_name"
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={warddata?.wardName}
                      onChange={(e) => setFormdata(e.target.value)}
                    />
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
    </ManageHospitalsContainer>
  )
}