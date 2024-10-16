import { useTranslation } from "react-i18next"
import { Actiontableprobe, DelProbeButton, ManageProbeBody, ManageProbeContainer, ManageProbeHeader, ProbeCH } from "../../../style/components/manage.probe"
import Addprobe from "./addprobe"
import DataTable, { TableColumn } from "react-data-table-component"
import { probeType } from "../../../types/probe.type"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, ProbeState, UtilsStateStore } from "../../../types/redux.type"
import { swalWithBootstrapButtons } from "../../../components/dropdown/sweetalertLib"
import { RiDeleteBin2Line } from "react-icons/ri"
import axios, { AxiosError } from "axios"
import { storeDispatchType } from "../../../stores/store"
import { fetchProbeData } from "../../../stores/probeSlice"
import Swal from "sweetalert2"
import { responseType } from "../../../types/response.type"
import { setSearchQuery, setShowAlert } from "../../../stores/utilsStateSlice"
import { useEffect, useMemo } from "react"
import FilterHosAndWard from "../../../components/dropdown/filter.hos.ward"

export default function Probesetting() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery, cookieDecode, wardId, hosId } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { probeData } = useSelector<DeviceStateStore, ProbeState>((state) => state.probe)
  const { token, userLevel } = cookieDecode

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

  // Filter Data
  let filteredItems = useMemo(() => {
    return wardId !== ''
      ? probeData.filter((item) => item.device.wardId.includes(wardId))
      : hosId && hosId !== ''
        ? probeData.filter((item) => item.device.ward.hosId.includes(hosId))
        : probeData
  }, [wardId, probeData, hosId])

  const filter = filteredItems.filter((f) => f.devSerial && f.devSerial.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <ManageProbeContainer>
      <ManageProbeHeader>
        <h3>{t('titleManageProbe')}</h3>
        <div>
          {
            userLevel !== '4' && <FilterHosAndWard />
          }
          {
            userLevel !== '2' && userLevel !== '3' &&
            <Addprobe
              pagestate={'add'}
            />
          }
        </div>
      </ManageProbeHeader>
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
