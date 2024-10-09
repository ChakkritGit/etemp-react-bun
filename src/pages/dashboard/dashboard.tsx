import { Container } from "react-bootstrap"
import { DashboardFlex, DashboardHeadFilter, Dashboardanalys } from "../../style/style"
import Dropdown from "../../components/dashboard/dropdown"
import Chart from "../../components/dashboard/chart"
import Devicesinfo from "../../components/dashboard/devicesinfo"
import Table from "../../components/dashboard/table"
import { DeviceState, DeviceStateStore, LogState, UtilsStateStore } from "../../types/redux.type"
import { useDispatch, useSelector } from "react-redux"
import PageLoading from "../../components/loading/page.loading"
import { useEffect } from "react"
import { storeDispatchType } from "../../stores/store"
import { setDeviceId, setSearchQuery, setSerial } from "../../stores/utilsStateSlice"
import { fetchDevicesLog } from "../../stores/LogsSlice"
import { cookies } from "../../constants/constants"
import { useNavigate } from "react-router-dom"
import { OfflineDataFlex } from "../../style/components/dashboard.styled"
import { RiBarChartBoxLine, RiTableView } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import FilterHosAndWard from "../../components/dropdown/filter.hos.ward"

export default function Dashboard() {
  const dispatch = useDispatch<storeDispatchType>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { devicesLogs } = useSelector<DeviceStateStore, LogState>((state) => state.logs)
  const { expand, cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { token } = cookieDecode

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  useEffect(() => {
    if (!token) return
    if (cookies.get('devid')) return
    dispatch(fetchDevicesLog({ deviceId: devices[0]?.devId, token }))
    dispatch(setDeviceId(devices[0]?.devId))
    dispatch(setSerial(devices[0]?.devSerial))
  }, [devices, token])

  return (
    <Container fluid>
      <DashboardFlex>
        <DashboardHeadFilter $primary={expand}>
          <Dropdown />
          <FilterHosAndWard />
        </DashboardHeadFilter>
        {
          devicesLogs.log?.length > 0 ?
            <>
              <Devicesinfo
                devicesData={devicesLogs}
                index={0}
              />
              <Dashboardanalys>
                <Chart
                  data={devicesLogs.log.slice(0, 80)}
                  tempMin={devicesLogs.probe[0]?.tempMin}
                  tempMax={devicesLogs.probe[0]?.tempMax}
                />
                <Table
                  data={devicesLogs.log.slice(0, 80)}
                  devSn={devicesLogs.devSerial}
                  devStatus={devicesLogs.devStatus}
                  tempMin={devicesLogs.probe[0]?.tempMin}
                  tempMax={devicesLogs.probe[0]?.tempMax}
                />
              </Dashboardanalys>
            </>
            :
            devicesLogs.log?.length === 0 ?
              <>
                <Devicesinfo
                  devicesData={devicesLogs}
                  index={0}
                />
                <OfflineDataFlex>
                  <span>{t('todayNoData')}</span>
                  <div>
                    <div>
                      <div>
                        <RiBarChartBoxLine size={62} />
                      </div>
                      <div>
                        <span>{t('pageChart')}</span>
                        <button
                          onClick={() => navigate(`/dashboard/chart`, { state: { tempMin: devicesLogs.probe[0]?.tempMin, tempMax: devicesLogs.probe[0]?.tempMax } })}>
                          {t('seeLastData')}
                        </button>
                      </div>
                    </div>
                    <div>
                      <div>
                        <RiTableView size={62} />
                      </div>
                      <div>
                        <span>{t('pageTable')}</span>
                        <button
                          onClick={() => navigate(`/dashboard/table`, { state: { tempMin: devicesLogs.probe[0]?.tempMin, tempMax: devicesLogs.probe[0]?.tempMax } })}>
                          {t('seeLastData')}
                        </button>
                      </div>
                    </div>
                  </div>
                </OfflineDataFlex>
              </>
              :
              <PageLoading />
        }
      </DashboardFlex>
    </Container>
  )
}
