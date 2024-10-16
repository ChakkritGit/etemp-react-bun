import { Breadcrumbs, Typography } from "@mui/material"
import { Container, Dropdown, Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import {
  RiArrowRightSLine, RiDashboardFill, RiFilePdf2Line,
  RiFolderSharedLine, RiImageLine, RiLoader2Line, RiLoader3Line
} from "react-icons/ri"
import { Link, useNavigate } from "react-router-dom"
import CompareChartComponent from "../../components/dashboard/compare.chart.component"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../../components/loading/loading"
import {
  ExportandAuditFlex, FilterContainer, FilterSearchBtn,
  FullchartBodyChartCon, FullchartHead, FullchartHeadBtn,
  FullchartHeadExport, FullchartHeadLeft, LineHr, TableInfoDevice
} from "../../style/style"
import { useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import html2canvas from "html2canvas"
import { setSearchQuery, setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import axios, { AxiosError } from "axios"
import Swal from "sweetalert2"
import { wardsType } from "../../types/ward.type"
import { responseType } from "../../types/response.type"
import { devicesType } from "../../types/device.type"
import { cookies, styleElement } from "../../constants/constants"
import ImagesOne from '../../assets/images/Thanes.png'
import { WaitExportImage } from "../../style/components/page.loading"
import FilterHosAndWard from "../../components/dropdown/filter.hos.ward"
import { CompareType } from "../../types/log.type"

const Comparechart = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const navigate = useNavigate()
  const { expand, cookieDecode, deviceId, wardId } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { hosName, token, hosImg } = cookieDecode
  const [pageNumber, setPagenumber] = useState(1)
  const canvasChartRef = useRef<HTMLDivElement | null>(null)
  const tableInfoRef = useRef<HTMLDivElement | null>(null)
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })
  const [devices, setDevices] = useState<CompareType[]>([])
  const [isloading, setIsLoading] = useState(false)
  const [validationData, setValidationData] = useState<wardsType>()
  const [devData, setDevData] = useState<devicesType>()

  const fetchWard = async () => {
    try {
      const response = await axios.get<responseType<wardsType>>(`${import.meta.env.VITE_APP_API}/ward/${devData?.wardId}`, { headers: { authorization: `Bearer ${token}` } })
      setValidationData(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error('Uknown Error', error)
      }
    }
  }

  useEffect(() => {
    if (devData) {
      fetchWard()
    }
  }, [devData])

  const fetchData = async () => {
    try {
      const responseData = await axios
        .get(`${import.meta.env.VITE_APP_API}/device/${deviceId ? deviceId : cookies.get('devid')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setDevData(responseData.data.data)
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

  const fetchCompare = async () => {
    try {
      setDevices([])
      const res = await axios.get(`${import.meta.env.VITE_APP_API}/utils/compare`, {
        headers: { authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(600000)
      })
      setDevices(res.data.data)
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

  const fetchCompareCustom = async () => {
    const { endDate, startDate } = filterDate
    let startDateNew = new Date(filterDate.startDate)
    let endDateNew = new Date(filterDate.endDate)
    let timeDiff = Math.abs(endDateNew.getTime() - startDateNew.getTime())
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    if (startDate !== '' || endDate !== '') {
      if (diffDays <= 31) {
        try {
          setDevices([])
          const res = await axios.get(`${import.meta.env.VITE_APP_API}/utils/compare?start=${startDate}&end=${endDate}`, {
            headers: { authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(600000)
          })
          setDevices(res.data.data)
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
      } else {
        Swal.fire({
          title: t('alertHeaderWarning'),
          text: t('customMessageLogData'),
          icon: "warning",
          timer: 3000,
          showConfirmButton: false,
        })
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
    if (!token) return
    fetchCompare()
  }, [token])

  useEffect(() => {
    if (String(deviceId) !== 'undefined' && token) fetchData()
  }, [pageNumber, token, deviceId])

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const exportChart = () => {
    setIsLoading(true)
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          if (canvasChartRef.current) {
            canvasChartRef.current.style.width = '1645px'
            canvasChartRef.current.style.color = 'black'

            document.head.appendChild(styleElement)

            await new Promise((resolve) => setTimeout(resolve, 500))
            const canvas = canvasChartRef.current

            html2canvas(canvas).then((canvasImage) => {
              resolve(canvasImage.toDataURL('image/png', 1.0))

              document.head.removeChild(styleElement)
            }).catch((error) => {
              reject(error)
            })
          }
        } catch (error) {
          reject(error)
        }
      }, 600)
    })
  }

  const handleDownload = async (type: string) => {
    if (canvasChartRef.current && tableInfoRef.current) {
      document.head.appendChild(styleElement)

      tableInfoRef.current.style.display = 'flex'
      tableInfoRef.current.style.color = 'black'
      canvasChartRef.current.style.color = 'black'

      const canvas = canvasChartRef.current

      const promise = html2canvas(canvas).then((canvasImage) => {
        const dataURL = canvasImage.toDataURL(type === 'png' ? 'image/png' : 'image/jpg', 1.0);

        let pagename = ''
        if (pageNumber === 1) {
          pagename = 'Day_Chart'
        } else if (pageNumber === 2) {
          pagename = 'Week_Chart'
        } else {
          pagename = 'Custom_Chart'
        }

        const link = document.createElement('a')
        link.href = dataURL
        link.download = `${pagename}${type === 'png' ? '.png' : '.jpg'}`

        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
      }).catch((error) => {
        console.error('Error generating image:', error)
        throw new Error('Failed to download the image')
      }).finally(() => {
        document.head.removeChild(styleElement)
        if (!tableInfoRef.current) return
        tableInfoRef.current.style.display = 'none'
      })

      toast.promise(
        promise,
        {
          loading: 'Downloading',
          success: <span>Downloaded</span>,
          error: <span>Something went wrong</span>,
        }
      )
    } else {
      toast.error("Data not found")
    }
  }

  let filteredDevicesList = useMemo(() => {
    return wardId !== ''
      ? devices.filter((item) => item.wardId.includes(wardId))
      : devices;
  }, [wardId, devices])

  return (
    <Container fluid>
      <Breadcrumbs className="mt-3"
        separator={<RiArrowRightSLine fontSize={20} />}
      >
        <Link to={'/dashboard'}>
          <RiDashboardFill fontSize={20} />
        </Link>
        <Typography className="compare-text">{t('chartCompare')}</Typography>
      </Breadcrumbs>
      <FullchartHead>
        <FullchartHeadLeft>
          <FullchartHeadBtn $primary={pageNumber === 1} onClick={() => setPagenumber(1)}>{t('month')}</FullchartHeadBtn>
          <FullchartHeadBtn $primary={pageNumber === 3} onClick={() => setPagenumber(3)}>{t('chartCustom')}</FullchartHeadBtn>
        </FullchartHeadLeft>
        <div>
          <FilterHosAndWard />
          <ExportandAuditFlex>
            <Dropdown>
              <Dropdown.Toggle variant="0" className="border-0 p-0">
                <FullchartHeadExport>
                  <RiFolderSharedLine />
                  {t('export')}
                </FullchartHeadExport>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleDownload('png')}>
                  <RiImageLine />
                  <span>PNG</span>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleDownload('jpg')}>
                  <RiImageLine />
                  <span>JPG</span>
                </Dropdown.Item>
                <LineHr $mg={.5} />
                <Dropdown.Item onClick={async () => {
                  if (devices.length > 0) {
                    try {
                      const waitExport = await exportChart()
                      setIsLoading(false)
                      navigate('/dashboard/chart/preview', {
                        state: {
                          title: 'Chart-Report',
                          ward: validationData?.wardName,
                          image: ImagesOne,
                          hospital: validationData?.hospital.hosName,
                          devSn: devData?.devSerial,
                          devName: devData?.devDetail,
                          chartIMG: waitExport,
                          dateTime: String(new Date).substring(0, 25),
                          hosImg: hosImg,
                        }
                      })
                    } catch (error) {
                      Swal.fire({
                        title: t('alertHeaderError'),
                        text: t('descriptionErrorWrong'),
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      })
                    }
                  } else {
                    Swal.fire({
                      title: t('alertHeaderWarning'),
                      text: t('dataNotReady'),
                      icon: "warning",
                      timer: 2000,
                      showConfirmButton: false,
                    })
                  }
                }}>
                  <RiFilePdf2Line />
                  <span>PDF</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ExportandAuditFlex>
        </div>
      </FullchartHead>
      {pageNumber === 3 &&
        <FilterContainer>
          <Form.Control
            type="date"
            value={filterDate.startDate}
            onChange={(e) => setFilterDate({ ...filterDate, startDate: e.target.value })} />
          <Form.Control
            type="date"
            value={filterDate.endDate}
            onChange={(e) => setFilterDate({ ...filterDate, endDate: e.target.value })} />
          <FilterSearchBtn onClick={() => fetchCompareCustom()}>{t('searchButton')}</FilterSearchBtn>
        </FilterContainer>}
      <FullchartBodyChartCon $primary={expand} ref={canvasChartRef}>
        <TableInfoDevice ref={tableInfoRef}>
          <h4>{hosName}</h4>
        </TableInfoDevice>
        {
          filteredDevicesList.length > 0 ?
            <CompareChartComponent
              chartData={filteredDevicesList} />
            :
            <Loading loading={true} title={t('loading')} icn={<RiLoader3Line />} />
        }
      </FullchartBodyChartCon>
      {isloading && <WaitExportImage>
        <Loading loading={true} title={t('loading')} icn={<RiLoader2Line fill="white" />} />
      </WaitExportImage>}
    </Container>
  )
}

export default Comparechart