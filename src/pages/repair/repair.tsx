import { Container, Modal } from "react-bootstrap"
import {
  Actiontabledev, DelUserButton, FormBtn, FormFlexBtn,
  ManageRepairBody, ModalHead, RepairContainer,
  RepairHeader, RepairPrintBtn
} from "../../style/style"
import Addrepair from "./addrepair"
import { useEffect, useRef, useState } from "react"
import axios, { AxiosError } from "axios"
import { repairType } from "../../types/repair.type"
import DataTable, { TableColumn } from "react-data-table-component"
import { useTranslation } from "react-i18next"
import { swalWithBootstrapButtons } from "../../components/dropdown/sweetalertLib"
import { RiCloseLine, RiDeleteBin2Line, RiPrinterLine } from "react-icons/ri"
import Swal from "sweetalert2"
import ReactToPrint from "react-to-print"
import PrintComponent from "./printComponent"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { responseType } from "../../types/response.type"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { setRefetchdata, setSearchQuery, setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"

export default function Repair() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery, cookieDecode, reFetchData } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [repairData, setRepairdata] = useState<repairType[]>([])
  const [repairDataPrint, setRepairdataprint] = useState<repairType[]>([])
  const [show, setshow] = useState(false)
  const componentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const closemodal = () => {
    setshow(false)
  }

  const fetchData = async () => {
    try {
      const response = await axios
        .get<responseType<repairType[]>>(`${import.meta.env.VITE_APP_API}/repair`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setRepairdata(response.data.data)
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

  const deleteRepair = async (reID: string) => {
    try {
      const response = await axios
        .delete<responseType<repairType>>(`${import.meta.env.VITE_APP_API}/repair/${reID}`, {
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

  useEffect(() => {
    if (!token) return
    fetchData()
  }, [token])

  const printrepair = async (reID: string) => {
    const newArr = await repairData.filter((items) => items.repairId === reID)
    setRepairdataprint(newArr)
    setshow(true)
  }

  const columns: TableColumn<repairType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
    },
    {
      name: t('deviceSerialTb'),
      selector: (items) => items.device.devSerial,
      sortable: false,
      center: true,
      width: '200px'
    },
    {
      name: t('hisUsername'),
      selector: (item) => item.repairInfo,
      sortable: false,
      center: true
    },
    {
      name: t('hisDetail'),
      selector: (item) => item.repairDetails,
      sortable: false,
      center: true
    },
    {
      name: t('hosAddress'),
      selector: (item) => item.repairLocation,
      sortable: false,
      center: true
    },
    {
      name: t('hosTel'),
      selector: (item) => item.telePhone,
      sortable: false,
      center: true
    },
    {
      name: t('dashWarranty'),
      cell: ((item) => {
        if (item.warrantyStatus === '1') {
          return <span>{t('tabWarrantyaftersale')}</span>
        } else if (item.warrantyStatus === '2') {
          return <span>{t('tabWarrantyExpired')}</span>
        } else if (item.warrantyStatus === '3') {
          return <span>{t('warrantyMa')}</span>
        } else {
          return <span>{t('warrantyEtc')}</span>
        }
        return <></>
      }),
      sortable: false,
      center: true
    },
    {
      name: t('action'),
      cell: ((item, index) => (
        <Actiontabledev key={index}>
          <Addrepair
            pagestate='edit'
            fetchdata={fetchData}
            devdata={item}
          />
          <DelUserButton onClick={() =>
            swalWithBootstrapButtons
              .fire({
                title: t('deleteRepairTitle'),
                text: t('notReverseText'),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: t('confirmButton'),
                cancelButtonText: t('cancelButton'),
                reverseButtons: false,
              })
              .then((result) => {
                if (result.isConfirmed) {
                  deleteRepair(item.repairId)
                }
              })}>
            <RiDeleteBin2Line size={16} />
          </DelUserButton>
        </Actiontabledev>
      )),
      sortable: false,
      center: true,
    },
    {
      name: t('print'),
      cell: ((items) => {
        return <RepairPrintBtn key={items.repairId} onClick={() => printrepair(items.repairId)}>
          <RiPrinterLine size={16} />
        </RepairPrintBtn>
      }),
      sortable: false,
      center: true,
    }
  ]

  const filteredItems = repairData.filter(item => item.repairInfo && item.repairInfo.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Container fluid>
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        <RepairContainer>
          <RepairHeader className="mb-3 mt-3">
            <h3>{t('titleRepair')}</h3>
            <Addrepair
              pagestate='add'
              fetchdata={fetchData}
              devdata={{} as repairType}
            />
          </RepairHeader>
        </RepairContainer>
        <ManageRepairBody>
          {/* {JSON.stringify(repairData)} */}
          <DataTable
            className="hiTDLB-st"
            responsive={true}
            columns={columns}
            data={filteredItems}
            pagination
            paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
            fixedHeader
            fixedHeaderScrollHeight="calc(100dvh - 300px)"
          />
        </ManageRepairBody>

        <Modal show={show} size="lg" scrollable onHide={closemodal}>
          <Modal.Header>
            <ModalHead>
              <strong>
                Print
              </strong>
              <button onClick={closemodal}>
                <RiCloseLine />
              </button>
            </ModalHead>
          </Modal.Header>
          <Modal.Body>
            <PrintComponent
              data={repairDataPrint}
              componentRef={componentRef}
            />
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <ReactToPrint
                trigger={() =>
                  <FormBtn type="submit">
                    <RiPrinterLine />
                    Print
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
