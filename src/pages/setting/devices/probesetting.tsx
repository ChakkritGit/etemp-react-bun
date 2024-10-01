import { useTranslation } from "react-i18next"
import { Actiontableprobe, DelProbeButton, ManageProbeBody, ManageProbeContainer, ManageProbeHeader, ProbeCH } from "../../../style/components/manage.probe"
import Addprobe from "./addprobe"
import DataTable, { TableColumn } from "react-data-table-component"
import { probeType } from "../../../types/probe.type"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, ProbeState, UtilsStateStore } from "../../../types/redux.type"
import { swalWithBootstrapButtons } from "../../../components/dropdown/sweetalertLib"
import { RiCloseLine, RiDeleteBin2Line, RiFilter3Line } from "react-icons/ri"
import axios, { AxiosError } from "axios"
import { storeDispatchType } from "../../../stores/store"
import { fetchProbeData } from "../../../stores/probeSlice"
import Swal from "sweetalert2"
import { responseType } from "../../../types/response.type"
import { setHosId, setSearchQuery, setShowAlert, setWardId } from "../../../stores/utilsStateSlice"
import { useEffect, useState } from "react"
import { DeviceInfoSpan, DeviceInfoSpanClose } from "../../../style/style"
import Select from "react-select"
import { hospitalsType } from "../../../types/hospital.type"
import { useTheme } from "../../../theme/ThemeProvider"
import { wardsType } from "../../../types/ward.type"
import { cookieOptions, cookies } from "../../../constants/constants"

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

export default function Probesetting() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery, cookieDecode, wardId, hosId, tokenDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const hospitalsData = useSelector<DeviceStateStore, hospitalsType[]>((state) => state.arraySlice.hospital.hospitalsData)
  const wardData = useSelector<DeviceStateStore, wardsType[]>((state) => state.arraySlice.ward.wardData)
  const { probeData } = useSelector<DeviceStateStore, ProbeState>((state) => state.probe)
  const [wardName, setWardname] = useState<wardsType[]>([])
  const [filterdata, setFilterdata] = useState(false)
  const { token, userLevel, groupId } = cookieDecode
  const { theme } = useTheme()

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const deleteProbe = async (probeId: string) => {
    try {
      const response = await axios.delete<responseType<probeType>>(`${import.meta.env.VITE_APP_API}/probe/${probeId}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      dispatch(fetchProbeData(token))
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

  const columns: TableColumn<probeType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => <span>{index + 1}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeName'),
      cell: (items) => <span>{items.probeName ? items.probeName : 'Name is not assigned'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeType'),
      cell: (items) => <span>{items.probeType ? items.probeType : 'Type is not assigned'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeChanel'),
      cell: (items) => <ProbeCH>{items.probeCh}</ProbeCH>,
      sortable: false,
      center: true
    },
    {
      name: t('probeLocation'),
      cell: (items) => <span>{items.location ? items.location : '- -'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      cell: (items) => <span>{items.device.devSerial}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('action'),
      cell: (items, index) => (
        <Actiontableprobe key={index}>
          <Addprobe
            pagestate={'edit'}
            probeData={items}
            key={items.probeId}
          />
          {
            userLevel !== '2' && userLevel !== '3' && <DelProbeButton onClick={() =>
              swalWithBootstrapButtons
                .fire({
                  title: t('deleteProbe'),
                  text: t('deleteProbeText'),
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: t('confirmButton'),
                  cancelButtonText: t('cancelButton'),
                  reverseButtons: false,
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    deleteProbe(items.probeId)
                  }
                })}>
              <RiDeleteBin2Line size={16} />
            </DelProbeButton>
          }
        </Actiontableprobe>
      ),
      center: true,
      sortable: false,
    }
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
  const filteredItems = wardId !== '' ? probeData.filter(item => item.device.wardId.toLowerCase().includes(wardId.toLowerCase())) : probeData
  const filter = filteredItems.filter((f) => f.devSerial && f.devSerial.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <ManageProbeContainer>
      {
        userLevel !== '2' && userLevel !== '3' && <ManageProbeHeader>
          <h3>{t('titleManageProbe')}</h3>
          <div>
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
            <Addprobe
              pagestate={'add'}
            />
          </div>
        </ManageProbeHeader>
      }
      <ManageProbeBody>
        <DataTable
          columns={columns}
          data={filter}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
          pagination
          responsive
          fixedHeader
          fixedHeaderScrollHeight="calc(100dvh - 350px)"
        />
      </ManageProbeBody>
    </ManageProbeContainer>
  )
}
