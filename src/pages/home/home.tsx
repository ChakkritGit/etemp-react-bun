import { Container, Modal } from "react-bootstrap"
import DevicesCard from "../../components/home/devicesCard"
import {
  RiCloseLine, RiDoorClosedLine, RiDoorOpenLine, RiErrorWarningLine,
  RiFileCloseLine, RiFilter3Line,
  RiLayoutGridLine, RiListUnordered, RiSkipUpLine, RiTempColdLine
} from "react-icons/ri"
import Select from "react-select"
import {
  AboutBox, DatatableHome, DevHomeDetails, DevHomeHead, DevHomeHeadTile,
  DevHomeSecctionOne, DeviceCardFooterDoor, DeviceCardFooterDoorFlex,
  DeviceCardFooterInfo, DeviceInfoSpan, DeviceInfoSpanClose, DeviceInfoflex,
  DeviceListFlex, DeviceStateNetwork, FilterHomeHOSWARD, HomeContainerFlex, ListBtn,
  PaginitionContainer,
  SubWardColumnFlex
} from "../../style/style"
import DevicesInfoCard from "../../components/home/devicesInfoCard"
import { useTranslation } from "react-i18next"
import { ChangeEvent, useState } from "react"
import { useEffect } from "react"
import { wardsType } from "../../types/ward.type"
import { devicesType } from "../../types/device.type"
import { itemsFilter } from "../../animation/animate"
import Loading from "../../components/loading/loading"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setDeviceId, setSerial, setSearchQuery, setHosId, setWardId } from "../../stores/utilsStateSlice"
import { filtersDevices, setFilterDevice } from "../../stores/dataArraySlices"
import { RootState, storeDispatchType } from "../../stores/store"
import DataTable, { TableColumn } from "react-data-table-component"
import TableModal from "../../components/home/table.modal"
import PageLoading from "../../components/loading/page.loading"
import { probeType } from "../../types/probe.type"
import { FilterText } from "../../types/component.type"
import { cookieOptions, cookies, paginationCardHome } from "../../constants/constants"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { FloatingTop, TagCurrentHos } from "../../style/components/home.styled"
import { useTheme } from "../../theme/ThemeProvider"
import HomeCard from "../../components/home/home.card"
import { hospitalsType } from "../../types/hospital.type"
import Paginition from "../../components/filter/paginition"

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

export default function Home() {
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector((state: RootState) => state.devices)
  const { searchQuery, hosId, wardId, cookieDecode, tokenDecode } = useSelector((state: RootState) => state.utilsState)
  const devicesFilter = useSelector((state: RootState) => state.arraySlice.device.devicesFilter)
  const hospitalsData = useSelector((state: RootState) => state.arraySlice.hospital.hospitalsData)
  const wardData = useSelector((state: RootState) => state.arraySlice.ward.wardData)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [filterdata, setFilterdata] = useState(false)
  const [wardName, setWardname] = useState<wardsType[]>([])
  const [showticks, setShowticks] = useState(false)
  const [listAndgrid, setListandgrid] = useState(Number(localStorage.getItem('listGrid') ?? 1))
  const { userLevel, hosName, groupId } = cookieDecode
  const { theme } = useTheme()
  const [onFilteres, setOnFilteres] = useState(false)
  const [rowPerPage, setRowPerPage] = useState(cookies.get('rowperpage') ?? 10)
  const [cardActive, setCardActive] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [cardsPerPage, setCardsPerPage] = useState<number>(cookies.get('rowperpage') ?? 10)
  const [displayedCards, setDisplayedCards] = useState<devicesType[]>(devicesFilter ? devicesFilter.slice(0, cardsPerPage) : [])
  const totalPages = Math.ceil(devicesFilter.length / cardsPerPage)
  const [visible, setVisible] = useState(false)

  const isshowtk = () => {
    setShowticks(false)
  }

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const handleRowClicked = (row: devicesType) => {
    cookies.set('devid', row.devId, cookieOptions)
    cookies.set('devSerial', row.devSerial, cookieOptions)
    dispatch(setDeviceId(row.devId))
    dispatch(setSerial(row.devSerial))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  const updateLocalStorageAndDispatch = (key: string, id: string | undefined, action: Function) => {
    cookies.set(key, String(id), cookieOptions)
    dispatch(action(String(id)))
  }

  const getHospital = (hospitalID: string | undefined) => {
    if (hospitalID) {
      updateLocalStorageAndDispatch('selectHos', hospitalID, setHosId)
      setWardname(wardData.filter((items) => items.hospital.hosId === hospitalID))
    }
  }

  useEffect(() => {
    setWardname(wardData)
  }, [wardData])

  const getWard = (wardID: string | undefined) => {
    if (wardID !== '') {
      updateLocalStorageAndDispatch('selectWard', wardID, setWardId)
    } else {
      cookies.remove('selectWard', cookieOptions)
      dispatch(setWardId(''))
    }
  }

  useEffect(() => {
    if (!wardId) {
      dispatch(setFilterDevice(devices))
      return
    }

    let filteredDevicesList = wardId !== ''
      ? devices.filter((item) => item.wardId.toLowerCase().includes(wardId.toLowerCase()))
      : devices

    filteredDevicesList = filteredDevicesList.filter((item) =>
      item.devSerial?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.devDetail?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (cardActive === '1') {
      dispatch(setFilterDevice(filteredDevicesList.filter(dev => dev.noti.some(n => ['LOWER', 'OVER'].includes(n.notiDetail.split('/')[1])))))
    } else if (cardActive === '2') {
      dispatch(setFilterDevice(filteredDevicesList.filter(dev => dev.noti.some(n => n.notiDetail.split('/')[0].startsWith('PROBE')))))
    } else if (cardActive === '3') {
      dispatch(setFilterDevice(filteredDevicesList.filter(dev => dev._count?.log)))
    } else if (cardActive === '4') {
      dispatch(setFilterDevice(filteredDevicesList.filter(dev => dev.noti.some(n => n.notiDetail.split('/')[0] === 'AC'))))
    } else if (cardActive === '5') {
      dispatch(setFilterDevice(filteredDevicesList.filter(dev => dev.noti.some(n => n.notiDetail.split('/')[0] === 'SD'))))
    } else if (cardActive === '6') {
      navigate("/management/logadjust")
    } else if (cardActive === '7') {
      navigate("/repair")
    } else if (cardActive === '8') {
      navigate("/warranty")
    } else {
      dispatch(setFilterDevice(filteredDevicesList))
    }
  }, [searchQuery, devices, wardId, cardActive])

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }

  const columns: TableColumn<devicesType>[] = [
    {
      name: t('deviceNameTb'),
      selector: (items) => items.devDetail ? items.devDetail : 'Name is not assigned',
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      cell: (items) => items.devSerial,
      sortable: false,
      center: true
    },
    {
      name: t('deviceLocationTb'),
      cell: (items) => <span title={items.locInstall ? items.locInstall : '- -'}>{items.locInstall ? items.locInstall : '- -'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceTempTb'),
      cell: (items) => <span key={items.devSerial}>{items.log[0]?.tempAvg ? items.log[0]?.tempAvg.toFixed(2) + '°C' : 'No data'}</span>,
      sortable: false,
      center: true,
      width: '85px'
    },
    {
      name: t('deviceHumiTb'),
      selector: (items) => items.log[0]?.humidityAvg ? items.log[0].humidityAvg.toFixed(2) + '%' : 'No data',
      sortable: false,
      center: true,
      width: '85px'
    },
    {
      name: t('deviceProbeTb'),
      cell: ((items) => {
        const temp = items.log.filter((logItems) => logItems.devSerial === items.devSerial)
        const probe = items.probe.filter((logItems) => logItems.devSerial === items.devSerial)
        return (
          !onFilteres ?
            <DeviceCardFooterInfo
              $size
              $primary={temp[0]?.tempAvg >= probe[0]?.tempMax || temp[0]?.tempAvg <= probe[0]?.tempMin}>
              {temp[0]?.tempAvg >= probe[0]?.tempMax || temp[0]?.tempAvg <= probe[0]?.tempMin ?
                <RiErrorWarningLine />
                :
                <RiTempColdLine />
              }
            </DeviceCardFooterInfo>
            :
            <div>
              {`${items.noti.filter((n) => n.notiDetail.split('/')[1] === 'LOWER' || n.notiDetail.split('/')[1] === 'OVER').length} ${t('countNormalUnit')}`}
            </div>
        )
      }),
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('deviceDoorTb'),
      cell: ((items) => (
        !onFilteres ?
          <DeviceCardFooterDoorFlex key={items.devId} $primary>
            {
              items.probe[0]?.door === 1 ?
                <DeviceCardFooterDoor
                  $primary={items.log[0]?.door1 === "1"}
                >
                  {
                    items.log[0]?.door1 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                :
                items.probe[0]?.door === 2 ?
                  <>
                    <DeviceCardFooterDoor
                      $primary={items.log[0]?.door1 === "1"}
                    >
                      {
                        items.log[0]?.door1 === "1" ?
                          <RiDoorOpenLine />
                          :
                          <RiDoorClosedLine />
                      }
                    </DeviceCardFooterDoor>
                    <DeviceCardFooterDoor
                      $primary={items.log[0]?.door2 === "1"}
                    >
                      {
                        items.log[0]?.door2 === "1" ?
                          <RiDoorOpenLine />
                          :
                          <RiDoorClosedLine />
                      }
                    </DeviceCardFooterDoor>
                  </>
                  :
                  <>
                    <DeviceCardFooterDoor
                      $primary={items.log[0]?.door1 === "1"}
                    >
                      {
                        items.log[0]?.door1 === "1" ?
                          <RiDoorOpenLine />
                          :
                          <RiDoorClosedLine />
                      }
                    </DeviceCardFooterDoor>
                    <DeviceCardFooterDoor
                      $primary={items.log[0]?.door2 === "1"}
                    >
                      {
                        items.log[0]?.door2 === "1" ?
                          <RiDoorOpenLine />
                          :
                          <RiDoorClosedLine />
                      }
                    </DeviceCardFooterDoor>
                    <DeviceCardFooterDoor
                      $primary={items.log[0]?.door3 === "1"}
                    >
                      {
                        items.log[0]?.door3 === "1" ?
                          <RiDoorOpenLine />
                          :
                          <RiDoorClosedLine />
                      }
                    </DeviceCardFooterDoor>
                  </>
            }
          </DeviceCardFooterDoorFlex>
          :
          <div>
            {`${items.noti.filter((n) => n.notiDetail.split('/')[0].substring(0, 5) === 'PROBE' && n.notiDetail.split('/')[2].substring(0, 5) === 'ON').length} ${t('countNormalUnit')}`}
          </div>
      )),
      sortable: false,
      center: true
    },
    {
      name: t('deviceConnectTb'),
      cell: (items) => {
        return (
          !onFilteres ?
            <DeviceStateNetwork $primary={items.backupStatus === '0'}>
              {items.backupStatus === '0' ? t('deviceOffline') : t('deviceOnline')}
            </DeviceStateNetwork>
            :
            <div>
              {`${items._count?.log} ${t('countNormalUnit')}`}
            </div>
        )
      },
      sortable: false,
      center: true,
      width: '90px'
    },
    {
      name: t('devicePlugTb'),
      cell: (items) => {
        return (
          !onFilteres ?
            <span>{items.log[0]?.ac === '1' ? t('stateProblem') : t('stateNormal')}</span>
            :
            <div>{`${items.noti.filter((n) => n.notiDetail.split('/')[0] === 'AC').length} ${t('countNormalUnit')}`}</div>
        )
      },
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('deviceBatteryTb'),
      selector: (items) => items.log[0]?.battery ? items.log[0]?.battery + '%' : '- -',
      sortable: false,
      center: true,
      width: '83px'
    },
    {
      name: t('deviceWarrantyTb'),
      cell: ((items) => {
        const today = new Date()
        const targetDate = new Date(items.dateInstall)
        targetDate.setFullYear(targetDate.getFullYear() + 1)
        const timeDifference = targetDate.getTime() - today.getTime()
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
      center: true
    },
    {
      name: t('deviceActionTb'),
      cell: ((items) => {
        return (
          <TableModal
            key={items.devSerial}
            deviceData={items}
            fetchData={filtersDevices}
          />
        )
      }),
      sortable: false,
      center: true
    }
  ]

  const subDeviceColumns: TableColumn<probeType>[] = [
    {
      name: t('probeChannelSubTb'),
      cell: (items, index) => <span key={index}>{items.probeCh}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeNameSubTb'),
      cell: (items, index) => <span key={index}>{items.probeName ? items.probeName : 'Name is not assigned'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeTypeSubTb'),
      cell: (items, index) => <span key={index}>{items.probeType ? items.probeType : 'Type is not assigned'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeTempSubTb'),
      cell: (items, index) => <span key={index}>{devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)[0]?.tempAvg ? devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)[0]?.tempAvg.toFixed(2) + '°C' : 'Data not found'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeHumiSubTb'),
      cell: (items, index) => <span key={index}>{devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)[0]?.humidityAvg ? devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)[0]?.humidityAvg.toFixed(2) + '%' : 'Data not found'}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceProbeTb'),
      cell: ((items) => {
        const temp = devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.filter((logItems) => logItems.probe === items.probeCh)
        return <DeviceCardFooterInfo
          $size
          $primary={temp[0]?.tempAvg >= items.tempMax || temp[0]?.tempAvg <= items.tempMin ? true : false}>
          {temp[0]?.tempAvg >= items.tempMax || temp[0]?.tempAvg <= items.tempMin ?
            <RiErrorWarningLine />
            :
            <RiTempColdLine />
          }
        </DeviceCardFooterInfo>
      }),
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('probeDoorSubTb'),
      cell: ((items) =>
      (<DeviceCardFooterDoorFlex $primary>
        {
          items.door === 1 ?
            <DeviceCardFooterDoor
              $primary={
                devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1"
              }>
              {
                devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1" ?
                  <RiDoorOpenLine />
                  :
                  <RiDoorClosedLine />
              }
            </DeviceCardFooterDoor>
            :
            items.door === 2 ?
              <>
                <DeviceCardFooterDoor
                  $primary={
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1"
                  }>
                  {
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door2 === "1"
                  }>
                  {
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door2 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
              </>
              :
              <>
                <DeviceCardFooterDoor
                  $primary={
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1"
                  }>
                  {
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door1 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door2 === "1"
                  }>
                  {
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door2 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
                <DeviceCardFooterDoor
                  $primary={
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door3 === "1"
                  }>
                  {
                    devicesFilter.filter((devItems) => devItems.devSerial === items.devSerial)[0]?.log.find((value) => value.probe === items.probeCh)?.door3 === "1" ?
                      <RiDoorOpenLine />
                      :
                      <RiDoorClosedLine />
                  }
                </DeviceCardFooterDoor>
              </>
        }
      </DeviceCardFooterDoorFlex>
      )),
      sortable: false,
      center: true
    },
  ]

  const ExpandedComponent = ({ data }: { data: devicesType }) => {
    const { probe } = data
    return (
      <>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        <SubWardColumnFlex>
          <DataTable
            columns={subDeviceColumns}
            data={probe}
            responsive
            dense

          />
        </SubWardColumnFlex>
      </>
    )
  }

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

  const allWard = { wardId: '', wardName: 'ALL', wardSeq: 0, hosId: '', createAt: '', updateAt: '', hospital: {} as hospitalsType }

  const updatedWardData = [allWard, ...wardName]

  useEffect(() => {
    // setCurrentPage(0)
    setDisplayedCards(devicesFilter ? devicesFilter.slice(0, cardsPerPage) : [])
    showPage(0, searchQuery)
  }, [searchQuery, devicesFilter, cardsPerPage, rowPerPage])

  useEffect(() => {
    showPage(currentPage, searchQuery)
  }, [currentPage, devicesFilter, cardsPerPage])

  const showPage = (pageNumber: number, query: string = '') => {
    const startIndex = pageNumber * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    const filteredCards = devicesFilter ? (query ? devicesFilter.filter(card => [card?.devDetail, card?.locInstall, card?.devSerial].some(attr => attr?.toLowerCase().includes(query.toLowerCase()))) : devicesFilter) : []
    const cardsToDisplay = filteredCards ? filteredCards.slice(startIndex, endIndex) : []
    setDisplayedCards(cardsToDisplay)
  }

  const changePage = (change: number) => {
    const newPage = currentPage + change
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage)
    }
  }

  const displaySelectDevices = (event: ChangeEvent<HTMLSelectElement>) => {
    setCardsPerPage(Number(event.target.value))
    setRowPerPage(Number(event.target.value))
    cookies.set('rowperpage', Number(event.target.value), cookieOptions)
  }

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Container className="home-lg">
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        {
          devices.length > 0 ?
            <HomeContainerFlex>
              <DevHomeHeadTile>
                <h5>
                  {t('showAllBox')}
                </h5>
                {
                  userLevel === '0' && <TagCurrentHos>
                    {
                      `${hospitalsData.filter((f) => f.hosId?.toLowerCase().includes(hosId?.toLowerCase()))[0]?.hosName ?? hosName} - ${wardData?.filter((w) => w.wardId?.toLowerCase().includes(wardId?.toLowerCase()))[0]?.wardName ?? 'ALL'}`
                    }
                  </TagCurrentHos>
                }
              </DevHomeHeadTile>
              <DevHomeSecctionOne>
                <HomeCard
                  deviceData={devices}
                  cardActive={cardActive}
                  setCardActive={setCardActive}
                  wardId={wardId}
                  setOnFilteres={setOnFilteres}
                />
              </DevHomeSecctionOne>
              <AboutBox>
                <h5>{t('detailAllBox')}</h5>
                <DeviceInfoflex>
                  {
                    userLevel !== '3' &&
                    <>
                      {!filterdata &&
                        <DeviceInfoSpan onClick={() => setFilterdata(true)}>
                          {t('deviceFilter')}
                          <RiFilter3Line />
                        </DeviceInfoSpan>}
                      <FilterHomeHOSWARD>
                        {
                          filterdata &&
                          <DevHomeHead>
                            <motion.div
                              variants={itemsFilter}
                              initial="hidden"
                              animate="visible"
                            >
                              {
                                userLevel !== '2' && <Select
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
                                options={mapOptions<Ward, keyof Ward>(updatedWardData, 'wardId', 'wardName')}
                                defaultValue={mapDefaultValue<Ward, keyof Ward>(wardName, wardId !== groupId ? groupId : wardId, 'wardId', 'wardName')}
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
                            </motion.div>
                            <DeviceInfoSpanClose onClick={() => setFilterdata(false)}>
                              <RiCloseLine />
                            </DeviceInfoSpanClose>
                          </DevHomeHead>
                        }
                      </FilterHomeHOSWARD>
                    </>
                  }
                  <DeviceListFlex>
                    <ListBtn $primary={listAndgrid === 1} onClick={() => {
                      localStorage.setItem('listGrid', String(1))
                      setListandgrid(1)
                    }}>
                      <RiListUnordered />
                    </ListBtn>
                    <ListBtn $primary={listAndgrid === 2} onClick={() => {
                      localStorage.setItem('listGrid', String(2))
                      setListandgrid(2)
                    }}>
                      <RiLayoutGridLine />
                    </ListBtn>
                  </DeviceListFlex>
                </DeviceInfoflex>
              </AboutBox>
              {
                listAndgrid === 1 ?
                  <DatatableHome>
                    <DataTable
                      responsive={true}
                      columns={columns}
                      data={devicesFilter}
                      paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
                      paginationPerPage={rowPerPage}
                      onRowClicked={handleRowClicked}
                      expandableRowsComponent={ExpandedComponent}
                      onChangeRowsPerPage={(n) => { setRowPerPage(n); cookies.set('rowperpage', n, cookieOptions) }}
                      highlightOnHover
                      pagination
                      expandableRows
                      pointerOnHover
                      fixedHeader
                      fixedHeaderScrollHeight="calc(100dvh - 450px)"
                    />
                  </DatatableHome>
                  :
                  <DevHomeDetails $primary={displayedCards.length === 0} $limitListFlex={displayedCards.length < 5 && displayedCards.length > 0}>
                    <div>
                      {
                        displayedCards.length > 0 ?
                          displayedCards.map((item, index) =>
                            <DevicesInfoCard
                              devicesdata={item}
                              keyindex={index}
                              key={item.devSerial}
                              fetchData={filtersDevices}
                              onFilter={onFilteres}
                            />
                          )
                          :
                          <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                      }
                    </div>
                    <PaginitionContainer>
                      <div></div>
                      <Paginition
                        currentPage={currentPage}
                        cardsPerPage={cardsPerPage}
                        changePage={changePage}
                        displaySelectDevices={displaySelectDevices}
                        displayedCards={displayedCards}
                        userdata={devicesFilter}
                        pagPerpage={paginationCardHome}
                        totalPages={totalPages}
                      />
                    </PaginitionContainer>
                  </DevHomeDetails>
              }
            </HomeContainerFlex>
            :
            <PageLoading />
        }

        <FloatingTop $primary={visible} onClick={scrollToTop}>
          <RiSkipUpLine size={24} />
        </FloatingTop>

        <Modal show={showticks} onHide={isshowtk}>
          <Modal.Header closeButton>
            <strong>Info</strong>
          </Modal.Header>
          <Modal.Body>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
                <div>
                  <DevicesCard
                    title={'โพรบ'}
                    count={Math.floor(Math.random() * 9)}
                    times={'ครั้ง'}
                    svg={<RiTempColdLine />}
                    cardname={'' as FilterText}
                    active={true}
                  />
                </div>
                <div style={{ textAlign: 'left', width: '250px' }}>
                  <strong>พื้นหลังการ์ดเป็นสีฟ้า</strong>
                  <br />
                  <span>
                    เมื่อพื้นหลังเป็นสีฟ้าแสดงว่าคุณกำลังฟิลเตอร์
                    รายการอุปกรณ์จะแสดงตามการ์ดที่คุณฟิลเตอร์
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
                <div style={{ textAlign: 'right', width: '250px' }}>
                  <strong>คลิกที่การ์ดอีกครั้งเพื่อยกเลิก</strong>
                  <br />
                  <span>
                    เมื่อคลิกที่การ์ดอีกครั้งจะเป็นการยกเลิกการฟิลเตอร์รายการอุปกรณ์
                  </span>
                </div>
                <div>
                  <DevicesCard
                    title={'โพรบ'}
                    count={Math.floor(Math.random() * 9)}
                    times={'ครั้ง'}
                    svg={<RiTempColdLine />}
                    cardname={'' as FilterText}
                    active={false}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </motion.div>
    </Container>
  )
}