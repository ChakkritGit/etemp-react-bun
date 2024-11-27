import axios, { AxiosError } from "axios"
import { useEffect, useMemo, useState } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import { useTranslation } from "react-i18next"
import { devicesType } from "../../../types/device.type"
import {
  Actiontabledev, DelUserButton, DevHomeHead, ManageDevSpanUnsetUserSelect, ManageDeviceBody,
  ManageDevicesContainer, ManageHospitalsHeader,
  NavRightPipe,
  Reactive,
  SpanStatusDev
} from "../../../style/style"
import { RiLoopRightFill, RiShutDownLine, RiTimer2Line } from "react-icons/ri"
import { swalWithBootstrapButtons } from "../../../components/dropdown/sweetalertLib"
import Adddevform from "./adddevform"
import Swal from "sweetalert2"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { RootState, storeDispatchType } from "../../../stores/store"
import { fetchDevicesData } from "../../../stores/devicesSlices"
import PageLoading from "../../../components/loading/page.loading"
import { responseType } from "../../../types/response.type"
import { setSearchQuery, setShowAlert } from "../../../stores/utilsStateSlice"
import Moveseqdev from "./moveseqdev"
import { socket } from "../../../services/websocket"
import { AdjustTime } from "../../../style/components/manage.dev"
import FilterHosWardTemporary from "../../../components/dropdown/filter.hos.ward.temp"

export default function Managedev() {
  const { t, i18n } = useTranslation()
  const langs = localStorage.getItem("lang")
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery, cookieDecode } = useSelector((state: RootState) => state.utilsState)
  const { token, userLevel } = cookieDecode
  const { devices } = useSelector((state: RootState) => state.devices)

  const [filterById, setFilterById] = useState({
    hosId: '',
    wardId: ''
  })
  const { hosId, wardId } = filterById

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  const deactiveDevices = async (dID: string, status: boolean) => {
    const url: string = `${import.meta.env.VITE_APP_API}/device/${dID}`
    try {
      const response = await axios
        .put<responseType<devicesType>>(url, {
          devStatus: !status ? '0' : '1'
        }, {
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
  }

  const columns: TableColumn<devicesType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('deviceSerialTb'),
      cell: (item) => (
        <ManageDevSpanUnsetUserSelect
          key={item.devId}
          onClick={() => {
            try {
              navigator.clipboard.writeText(item.devSerial)
              toast.success(t('copyToClip'))
            } catch (error) {
              console.error('Failed to copy: ', error)
              toast.error(t('copyToClipFaile'))
            }
          }}>
          {item.devSerial}
        </ManageDevSpanUnsetUserSelect>
      ),
      sortable: false,
      center: true,
    },
    {
      name: t('deviceLocationTb'),
      cell: (item) => item.locInstall || item.locInstall !== null ? item.locInstall : '- -',
      sortable: false,
      center: true,
    },
    {
      name: t('hospitals'),
      cell: (item) => item.ward?.hospital.hosName ? item.ward.hospital.hosName : '- -',
      sortable: false,
      center: true,
    },
    {
      name: t('ward'),
      cell: (item) => item.ward?.wardName ? item.ward.wardName : '- -',
      sortable: false,
      center: true,
    },
    {
      name: t('firmWareVer'),
      selector: item => item.firmwareVersion ? item.firmwareVersion : '- -',
      sortable: false,
      center: true,
    },
    {
      name: t('status'),
      cell: (item) => {
        if (!item.devStatus) {
          return <SpanStatusDev $primary={!item.devStatus}>{t('userInactive')}</SpanStatusDev>
        } else {
          return <SpanStatusDev>{t('userActive')}</SpanStatusDev>
        }
      },
      sortable: false,
      center: true,
    },
    {
      name: t('action'),
      cell: ((item, index) => (
        <Actiontabledev key={item.devId}>
          <Adddevform
            key={`${item.devId}${index}`}
            pagestate={'edit'}
            devdata={item}
          />
          {
            userLevel === '0' && (!item.devStatus ?
              <Reactive onClick={() =>
                swalWithBootstrapButtons
                  .fire({
                    title: t('reactivateDevice'),
                    text: t('reactivateDeviceText'),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t('confirmButton'),
                    cancelButtonText: t('cancelButton'),
                    reverseButtons: false,
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      deactiveDevices(item.devId, true)
                    }
                  })}>
                <RiLoopRightFill size={16} />
              </Reactive>
              :
              <DelUserButton onClick={() =>
                swalWithBootstrapButtons
                  .fire({
                    title: t('deactivateDevice'),
                    text: t('deactivateDeviceText'),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t('confirmButton'),
                    cancelButtonText: t('cancelButton'),
                    reverseButtons: false,
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      deactiveDevices(item.devId, false)
                    }
                  })}>
                <RiShutDownLine size={16} />
              </DelUserButton>)
          }
          <Moveseqdev
            devData={item}
          />
        </Actiontabledev>
      )),
      sortable: false,
      center: true,
    },
  ]

  // Filter Data
  let filteredItems = useMemo(() => {
    return wardId !== ''
      ? devices.filter((item) => item.wardId.includes(wardId))
      : hosId && hosId !== ''
        ? devices.filter((item) => item.ward.hospital.hosId.includes(hosId))
        : devices
  }, [wardId, devices, hosId])

  const filter = filteredItems.filter((f) => f.devSerial && f.devSerial.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <ManageDevicesContainer>
      <ManageHospitalsHeader className="mb-3 mt-3">
        <h3>{t('titleManageDevices')}</h3>
        <DevHomeHead>
          <FilterHosWardTemporary
            filterById={filterById}
            setFilterById={setFilterById}
          />
          {
            userLevel !== '2' && userLevel !== '3' && <div>
              <Adddevform
                pagestate={'add'}
                devdata={{} as devicesType}
              />
              <NavRightPipe />
              <AdjustTime onClick={() => socket.emit('send_schedule', 'time', (val: any) => {
                if (val === 'OK') Swal.fire({
                  title: t('alertHeaderSuccess'),
                  text: t('adjustTime'),
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false,
                })
              })}>
                <RiTimer2Line size={24} />
              </AdjustTime>
            </div>
          }
        </DevHomeHead>
      </ManageHospitalsHeader>
      <ManageDeviceBody>
        {
          devices.length > 0 ?
            <DataTable
              responsive={true}
              columns={columns}
              data={filter}
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
              pagination
              fixedHeader
              fixedHeaderScrollHeight="calc(100dvh - 350px)"
            />
            :
            <PageLoading />
        }
      </ManageDeviceBody>
    </ManageDevicesContainer>
  )
}
