import { Col, Container, Form, Modal, Row } from "react-bootstrap"
import { DelWarrantyButton, DetailFlex, DetailWarranty, FormBtn, FormFlexBtn, ModalHead, WarrantyBody, WarrantyHead, WarrantyHeadBtn } from "../../style/style"
import { FormEvent, useEffect, useRef, useState } from "react"
import Loading from "../../components/loading/loading"
import { useTranslation } from "react-i18next"
import { RiAddLine, RiCloseLine, RiDeleteBin2Line, RiEditLine, RiFileCloseLine, RiInformationLine, RiLoader3Line, RiPrinterLine } from "react-icons/ri"
import DataTable, { TableColumn } from "react-data-table-component"
import ReactToPrint from "react-to-print"
import Printwarranty from "./printwarranty"
import { useDispatch, useSelector } from "react-redux"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import axios, { AxiosError } from "axios"
import { warrantyType } from "../../types/warranty.type"
import { responseType } from "../../types/response.type"
import { swalWithBootstrapButtons } from "../../components/dropdown/sweetalertLib"
import Swal from "sweetalert2"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import Select from 'react-select'
import { setRefetchdata, setSearchQuery, setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import { useTheme } from "../../theme/ThemeProvider"
import { SingleValue } from "react-select"
import { AddWarrantyButton } from "../../style/components/warranty.styled"
import { hospitalsType } from "../../types/hospital.type"
import { companyList } from "../../constants/constants"

interface dataTableProps {
  warrantyData: warrantyType[]
}

interface WarrantyObjectType {
  devName?: string | undefined,
  productName?: string | undefined,
  productModel?: string | undefined,
  installDate?: string | undefined,
  customerName?: string | undefined,
  customerAddress?: string | undefined,
  saleDept?: string | undefined,
  invoice?: string | undefined,
  expire: string,
  warrStatus: boolean
}

type Option = {
  value: string,
  label: string,
}

type Hospital = {
  hosId: string,
  hosName: string,
}

type Company = {
  key: number,
  value: string,
}

type WarrantyOption = WithCount & {
  devName: string,
  devSerial: string
}

interface WithCount {
  _count?: {
    warranty: number
  }
}

export default function Warranty() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const [pagenumber, setpagenumber] = useState(1)
  const { searchQuery, cookieDecode, reFetchData } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const hospitalsData = useSelector<DeviceStateStore, hospitalsType[]>((state) => state.arraySlice.hospital.hospitalsData)
  const { token, userLevel } = cookieDecode
  const [show, setshow] = useState(false)
  const [deviceDetails, setDevicedetails] = useState<warrantyType[]>([])
  const [warrantyData, setWarrantyData] = useState<warrantyType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const componentRef = useRef<HTMLDivElement | null>(null)
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const [showTwo, setShowTwo] = useState(false)
  const [warrantyObject, setWarrantyObject] = useState({
    wardId: '',
    productName: '',
    devSerial: '',
    devName: '',
    invoice: '',
    installDate: '',
    expireData: '',
    customerName: '',
    customerAddress: '',
    saleDept: '',
  })
  const { wardId, devName, expireData, installDate, invoice, devSerial, productName, customerAddress, customerName, saleDept } = warrantyObject
  const { theme } = useTheme()
  const [pagestate, setPagestate] = useState<string>('add')

  useEffect(() => {
    dispatch(setSearchQuery(''))

    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [pagenumber])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get<responseType<warrantyType[]>>(`${import.meta.env.VITE_APP_API}/warranty`, {
        headers: { authorization: `Bearer ${token}` }
      })
      setWarrantyData(response.data.data)
      setIsLoading(false)
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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return
    fetchData()
  }, [token])

  const devicesArray = warrantyData.filter((items) => items.device.devSerial.toLowerCase().includes(searchQuery.toLowerCase()) || items.device.devDetail?.toLowerCase().includes(searchQuery.toLowerCase()))

  const expiredArray = devicesArray.filter((items) => {
    const today = new Date()
    const expiredDate = new Date(items.expire)
    // Use the expiredDate directly
    const timeDifference = expiredDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return daysRemaining <= 0
  })

  const onwarrantyArray = devicesArray.filter((items) => {
    const today = new Date()
    const expiredDate = new Date(items.expire)
    // Use the expiredDate directly
    const timeDifference = expiredDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return daysRemaining >= 0
  })

  const openmodal = (warrId: string) => {
    setDevicedetails(warrantyData.filter((items) => items.warrId === warrId))
    setshow(true)
  }

  const closemodal = () => {
    setshow(false)
  }

  const deleteWarranty = async (wId: string) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_APP_API}/warranty/${wId}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
      fetchData()
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

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }

  const columns: TableColumn<warrantyType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
    },
    {
      name: t('deviceNameTb'),
      selector: (items) => items.device.devDetail ?? '- -',
      sortable: false,
      center: true,
    },
    {
      name: t('deviceSerialTb'),
      selector: (items) => items.device.devSerial,
      sortable: false,
      center: true,
    },
    {
      name: t('deviceDate'),
      selector: (items) => `${new Date(String(items.installDate)).toLocaleString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
      })}`,
      sortable: false,
      center: true,
    },
    {
      name: t('deviceWarrantyTb'),
      cell: ((items) => {
        const today = new Date()
        const expiredDate = new Date(items.expire)
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

        return <span>
          {daysRemaining > 0
            ? years > 0
              ? `${years} ${t('year')} ${months} ${t('month')} ${remainingDays} ${t('day')}`
              : months > 0
                ? `${months} ${t('month')} ${remainingDays} ${t('day')}`
                : `${remainingDays} ${t('day')}`
            : t('tabWarrantyExpired')}
        </span>
      }),
      sortable: false,
      center: true,
    },
    {
      name: t('action'),
      cell: ((items) => {
        return <DetailFlex>
          <DetailWarranty
            key={items.warrId}
            onClick={() => openmodal(items.warrId)}>
            <RiInformationLine size={16} />
          </DetailWarranty>
          {
            userLevel !== '2' && userLevel !== '3' && <>
              <AddWarrantyButton
                onClick={() => {
                  openModalTwo();
                  setPagestate('edit');
                  setWarrantyObject({
                    ...warrantyObject, wardId: items.warrId, devName: String(items.devName), expireData: items.expire.substring(0, 10),
                    invoice: String(items.invoice), customerAddress: String(items.customerAddress),
                    customerName: String(items.customerName), devSerial: items.device.devSerial, installDate: String(items.installDate),
                    productName: String(items.productName), saleDept: String(items.saleDept)
                  })
                }}
                $primary
              >
                <RiEditLine />
              </AddWarrantyButton>
              <DelWarrantyButton onClick={() =>
                swalWithBootstrapButtons
                  .fire({
                    title: t('deleteWarranty'),
                    text: t('deleteWarrantyText'),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t('confirmButton'),
                    cancelButtonText: t('cancelButton'),
                    reverseButtons: false,
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      deleteWarranty(items.warrId)
                    }
                  })}>
                <RiDeleteBin2Line size={16} />
              </DelWarrantyButton>
            </>
          }
        </DetailFlex>
      }),
      sortable: false,
      center: true,
    },
  ]

  const DataTableComponent = ({ warrantyData }: dataTableProps) => (
    <DataTable
      responsive={true}
      columns={columns}
      data={warrantyData}
      pagination
      paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
      paginationPerPage={10}
      dense
      fixedHeader
      fixedHeaderScrollHeight="calc(100dvh - 320px)"
    />
  )

  const openModalTwo = () => {
    setShowTwo(true)
  }

  const closeModalTwo = () => {
    setShowTwo(false)
    setPagestate('add')
    setWarrantyObject({ ...warrantyObject, wardId: '', devName: '', expireData: '', invoice: '', customerAddress: '', customerName: '', devSerial: '', installDate: '', productName: '', saleDept: '' })
  }

  const setHosId = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    const selectedLabel = e?.label
    if (!selectedValue) return
    setWarrantyObject({ ...warrantyObject, customerAddress: hospitalsData.filter((items) => items.hosId.toLowerCase().includes(selectedValue.toLowerCase())).map((items) => items.hosAddress)[0], customerName: String(selectedLabel) })
  }

  const setSaleDept = (e: SingleValue<Option>) => {
    const selectedLabel = e?.label
    if (!selectedLabel) return
    setWarrantyObject({ ...warrantyObject, saleDept: selectedLabel })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (devName !== '' && expireData !== '' && devSerial !== '' && invoice !== '' && installDate !== '' && productName !== '' && customerAddress !== '' && customerName !== '' && saleDept !== '') {
      const body: WarrantyObjectType = {
        devName: devName,
        productName: productName,
        customerAddress: customerAddress,
        customerName: customerName,
        installDate: installDate,
        productModel: devSerial,
        saleDept: saleDept,
        expire: expireData,
        invoice: invoice,
        warrStatus: true
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API}/warranty`, body, {
          headers: { authorization: `Bearer ${token}` }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
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
      } finally {
        closeModalTwo()
        fetchData()
        setWarrantyObject({ ...warrantyObject, wardId: '', devName: '', expireData: '', invoice: '', customerAddress: '', customerName: '', devSerial: '', installDate: '', productName: '', saleDept: '' })
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
    if (wardId !== '' && devName !== '' && expireData !== '' && devSerial !== '' && invoice !== '' && installDate !== '' && productName !== '' && customerAddress !== '' && customerName !== '' && saleDept !== '') {
      const body: WarrantyObjectType = {
        devName: devName,
        productName: productName,
        customerAddress: customerAddress,
        customerName: customerName,
        installDate: installDate,
        productModel: devSerial,
        saleDept: saleDept,
        expire: expireData,
        invoice: invoice,
        warrStatus: true
      }
      try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API}/warranty/${wardId}`, body, {
          headers: { authorization: `Bearer ${token}` }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
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
      } finally {
        closeModalTwo()
        fetchData()
        setWarrantyObject({ ...warrantyObject, wardId: '', devName: '', expireData: '', invoice: '', customerAddress: '', customerName: '', devSerial: '', installDate: '', productName: '', saleDept: '' })
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

  const mapOptions = <T extends WithCount, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
    data.filter(item => item._count?.warranty === 0).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string,
    }))

  const mapDefaultValue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
    data.filter(item => item[valueKey] === id).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

  const mapOptionsHospital = <T, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValueHospital = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
    data.filter(item => item[labelKey] === id).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

  return (
    <Container fluid>
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        <WarrantyHead>
          <div>
            <WarrantyHeadBtn $primary={pagenumber === 1} onClick={() => setpagenumber(1)}>{t('tabWarrantyExpired')}</WarrantyHeadBtn>
            <WarrantyHeadBtn $primary={pagenumber === 2} onClick={() => setpagenumber(2)}>{t('tabWarrantyAfterSale')}</WarrantyHeadBtn>
            <WarrantyHeadBtn $primary={pagenumber === 3} onClick={() => setpagenumber(3)}>{t('tabWarrantyAll')}</WarrantyHeadBtn>
          </div>
          {userLevel !== '2' && userLevel !== '3' && <div>
            <AddWarrantyButton onClick={() => { openModalTwo(); setPagestate('add') }}>
              {t('addWarrantyButton')}
              <RiAddLine />
            </AddWarrantyButton>
          </div>}
        </WarrantyHead>
        <WarrantyBody>
          {
            !isLoading ?
              pagenumber === 1 ?
                <>
                  {
                    expiredArray.length > 0 ?
                      <DataTableComponent
                        warrantyData={expiredArray}
                      />
                      :
                      <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                  }
                </>
                :
                pagenumber === 2 ?
                  <>
                    {
                      onwarrantyArray.length > 0 ?
                        <DataTableComponent
                          warrantyData={onwarrantyArray}
                        />
                        :
                        <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                    }
                  </>
                  :
                  <>
                    {
                      devicesArray.length > 0 ?
                        <DataTableComponent
                          warrantyData={devicesArray}
                        />
                        :
                        <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                    }
                  </>
              :
              <Loading loading={true} title={t('loading')} icn={<RiLoader3Line />} />
          }
        </WarrantyBody>

        <Modal size='lg' show={showTwo} onHide={closeModalTwo}>
          <Modal.Header>
            <ModalHead>
              <strong>
                {
                  pagestate === "add" ?
                    t('addWarrantyButton')
                    :
                    t('editWarranty')
                }
              </strong>
              <button onClick={closeModalTwo}>
                <RiCloseLine />
              </button>
            </ModalHead>
          </Modal.Header>
          <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitEdit}>
            <Modal.Body>
              <Row>
                {/* <pre>
                  {JSON.stringify(warrantyObject, null, 2)}
                </pre> */}
                <Col lg={12}>
                  <Form.Label className="w-100">
                    {t('invoice')}
                    <Form.Control
                      type="text"
                      value={invoice}
                      onChange={(e) => setWarrantyObject({ ...warrantyObject, invoice: e.target.value })}
                      className="mt-2"
                    />
                  </Form.Label>
                </Col>
                <Col sm={12}>
                  <Form.Label className="w-100">
                    {t('productName')}
                    <Form.Control
                      type="text"
                      value={productName}
                      onChange={(e) => setWarrantyObject({ ...warrantyObject, productName: e.target.value })}
                      className="mt-2"
                    />
                  </Form.Label>
                </Col>
                {
                  pagestate === 'add' &&
                  <Col lg={12}>
                    <Form.Label className="w-100">
                      {t('selectDeviceDrop')}
                      <Select
                        options={mapOptions<WarrantyOption, keyof WarrantyOption>(devices, 'devName', 'devSerial')}
                        defaultValue={mapDefaultValue<WarrantyOption, keyof WarrantyOption>(devices, String(devName), 'devName', 'devSerial')}
                        onChange={(e) => setWarrantyObject({ ...warrantyObject, devName: String(e?.value), devSerial: String(e?.label.substring(0, 3) === "eTP" ? 'eTEMP' : 'i-TeMS') })}
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
                  </Col>
                }
                <Col sm={12}>
                  <Form.Label className="w-100">
                    {t('modelName')}
                    <Form.Control
                      type="text"
                      value={devSerial}
                      onChange={(e) => setWarrantyObject({ ...warrantyObject, devSerial: e.target.value })}
                      className="mt-2"
                    />
                  </Form.Label>
                </Col>
                <Col lg={6}>
                  <Form.Label className="w-100">
                    {t('installDate')}
                    <Form.Control
                      type="date"
                      value={installDate}
                      onChange={(e) => setWarrantyObject({ ...warrantyObject, installDate: e.target.value })}
                      className="mt-2"
                    />
                  </Form.Label>
                </Col>
                <Col lg={6}>
                  <Form.Label className="w-100">
                    {t('endDate')}
                    <Form.Control
                      type="date"
                      value={expireData}
                      onChange={(e) => setWarrantyObject({ ...warrantyObject, expireData: e.target.value })}
                      className="mt-2"
                    />
                  </Form.Label>
                </Col>
                <Col sm={12}>
                  <Form.Label className="w-100">
                    {t('customerName')}
                    <Select
                      options={mapOptionsHospital<Hospital, keyof Hospital>(hospitalsData, 'hosId', 'hosName')}
                      defaultValue={mapDefaultValueHospital<Hospital, keyof Hospital>(hospitalsData, String(customerName), 'hosId', 'hosName')}
                      onChange={setHosId}
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
                </Col>
                <Col sm={12}>
                  <Form.Label className="w-100">
                    {t('customerAddress')}
                    <Form.Control
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setWarrantyObject({ ...warrantyObject, customerAddress: e.target.value })}
                      className="mt-2"
                    />
                  </Form.Label>
                </Col>
                <Col sm={12}>
                  <Form.Label className="w-100">
                    {t('distributionCompany')}
                    <Select
                      options={mapOptionsHospital<Company, keyof Company>(companyList, 'key', 'value')}
                      defaultValue={mapDefaultValueHospital<Company, keyof Company>(companyList, String(saleDept), 'key', 'value')}
                      onChange={setSaleDept}
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

        <Modal scrollable show={show} onHide={closemodal} size="lg">
          <Modal.Header>
            <ModalHead>
              <strong>
                Details
              </strong>
              <button onClick={closemodal}>
                <RiCloseLine />
              </button>
            </ModalHead>
          </Modal.Header>
          <Modal.Body>
            {
              deviceDetails.length > 0 ?
                <Printwarranty
                  data={deviceDetails}
                  componentRef={componentRef}
                />
                :
                <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
            }
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <ReactToPrint
                trigger={() =>
                  <FormBtn type="submit">
                    <RiPrinterLine />
                    {t('print')}
                  </FormBtn>}
                content={() => componentRef.current}
                pageStyle={`@page { size: portrait; margin: 5mm; padding: 0mm; }`}
              />
            </FormFlexBtn>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Container>
  )
}
