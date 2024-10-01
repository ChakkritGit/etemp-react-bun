import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import { useTranslation } from "react-i18next"
import { devicesType } from "../../../types/device.type"
import {
  Actiontabledev, DelUserButton, DevHomeHead, DeviceInfoSpan, DeviceInfoSpanClose, ManageDevSpanUnsetUserSelect, ManageDeviceBody,
  ManageDevicesContainer, ManageHospitalsHeader,
  Reactive,
  SpanStatusDev
} from "../../../style/style"
import { RiCloseLine, RiFilter3Line, RiLoopRightFill, RiShutDownLine, RiTimer2Line } from "react-icons/ri"
import { swalWithBootstrapButtons } from "../../../components/dropdown/sweetalertLib"
import Adddevform from "./adddevform"
import Swal from "sweetalert2"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { useDispatch } from "react-redux"
import { storeDispatchType } from "../../../stores/store"
import { fetchDevicesData } from "../../../stores/devicesSlices"
import PageLoading from "../../../components/loading/page.loading"
import { responseType } from "../../../types/response.type"
import { setHosId, setSearchQuery, setShowAlert, setWardId } from "../../../stores/utilsStateSlice"
import Moveseqdev from "./moveseqdev"
import Select from "react-select"
import { hospitalsType } from "../../../types/hospital.type"
import { wardsType } from "../../../types/ward.type"
import { cookieOptions, cookies } from "../../../constants/constants"
import { useTheme } from "../../../theme/ThemeProvider"
import { socket } from "../../../services/websocket"
import { AdjustTime } from "../../../style/components/manage.dev"

type Option = {
  value: string,
  label: string,
}

interface Hospital {
  hosId: string,
  hosName: string,
}

interface Ward {
  wardId: string,
  wardName: string,
}

export default function Managedev() {
  const { t, i18n } = useTranslation()
  const langs = localStorage.getItem("lang")
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery, cookieDecode, hosId, wardId, tokenDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const hospitalsData = useSelector<DeviceStateStore, hospitalsType[]>((state) => state.arraySlice.hospital.hospitalsData)
  const wardData = useSelector<DeviceStateStore, wardsType[]>((state) => state.arraySlice.ward.wardData)
  const { token, userLevel, groupId } = cookieDecode
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const [wardName, setWardname] = useState<wardsType[]>([])
  const [filterdata, setFilterdata] = useState(false)
  const { theme } = useTheme()

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
      cell: ((item) => (
        <Actiontabledev key={item.devId}>
          <Adddevform
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

  const updateLocalStorageAndDispatch = (key: string, id: string | undefined, action: Function) => {
    cookies.set(key, String(id), cookieOptions)
    dispatch(action(String(id)))
  }

  const getHospital = (hospitalID: string | undefined) => {
    updateLocalStorageAndDispatch('selectHos', hospitalID, setHosId)
    setWardname(wardData.filter((items) => items.hospital.hosId === hospitalID))
  }

  useEffect(() => {
    setWardname(wardData)
  }, [wardData])

  const getWard = (wardID: string | undefined) => {
    updateLocalStorageAndDispatch('selectWard', wardID, setWardId)
  }

  // Filter Data
  const filteredItems = wardId !== '' ? devices.filter(item => item.wardId.toLowerCase().includes(wardId.toLowerCase())) : devices
  const filter = filteredItems.filter((f) => f.devSerial && f.devSerial.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <ManageDevicesContainer>
      <ManageHospitalsHeader className="mb-3 mt-3">
        <h3>{t('titleManageDevices')}</h3>
        <DevHomeHead>
          {!filterdata &&
            <DeviceInfoSpan onClick={() => setFilterdata(true)}>
              {t('deviceFilter')}
              <RiFilter3Line />
            </DeviceInfoSpan>}
          {
            filterdata &&
            <div>
              {
                userLevel !== '2' &&
                <Select
                  options={mapOptions<Hospital, keyof Hospital>(hospitalsData, 'hosId', 'hosName')}
                  defaultValue={mapDefaultValue<Hospital, keyof Hospital>(hospitalsData, hosId || tokenDecode.hosId, 'hosId', 'hosName')}
                  onChange={(e) => getHospital(e?.value)}
                  autoFocus={false}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                      borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                      boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                      borderRadius: "var(--border-radius-big)",
                      width: "200px"
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
              }
              <Select
                options={mapOptions<Ward, keyof Ward>(wardName, 'wardId', 'wardName')}
                defaultValue={mapDefaultValue<Ward, keyof Ward>(wardData, wardId !== groupId ? groupId : wardId, 'wardId', 'wardName')}
                onChange={(e) => getWard(e?.value)}
                autoFocus={false}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                    borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                    boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                    borderRadius: "var(--border-radius-big)",
                    width: "200px"
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
              <DeviceInfoSpanClose onClick={() => setFilterdata(false)}>
                <RiCloseLine />
              </DeviceInfoSpanClose>
            </div>
          }
          {
            userLevel !== '2' && userLevel !== '3' && <div>
              <Adddevform
                pagestate={'add'}
                devdata={{} as devicesType}
              />
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
