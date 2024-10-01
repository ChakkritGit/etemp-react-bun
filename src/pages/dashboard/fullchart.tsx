import { Container, Dropdown, Form } from "react-bootstrap"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import {
  AuditGraphBtn,
  CustomChart,
  ExportandAuditFlex,
  FilterContainer, FilterSearchBtn, FullcharComparetHeadBtn, FullchartBody,
  FullchartBodyChartCon, FullchartHead, FullchartHeadBtn,
  FullchartHeadExport, FullchartHeadLeft, LineHr, TableInfoDevice
} from "../../style/style"
import { BsStars } from "react-icons/bs"
import {
  RiDashboardFill, RiFilePdf2Line,
  RiFolderSharedLine, RiImageLine, RiLoader2Line
} from "react-icons/ri"
import { useEffect, useRef, useState } from "react"
import axios, { AxiosError } from "axios"
import { logtype } from "../../types/log.type"
import { devicesType } from "../../types/device.type"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import ImagesOne from '../../assets/images/Thanes.png'
import html2canvas from 'html2canvas'
import { swalOptimizeChartButtons } from "../../components/dropdown/sweetalertLib"
import { RiArrowRightSLine } from "react-icons/ri"
import toast from "react-hot-toast"
import Apexchart from "../../components/dashboard/apexchart"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { cookies, getDateNow, styleElement } from "../../constants/constants"
import { responseType } from "../../types/response.type"
import { wardsType } from "../../types/ward.type"
import { setSearchQuery, setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import PageLoading from "../../components/loading/page.loading"
import { WaitExportImage } from "../../style/components/page.loading"
import Loading from "../../components/loading/loading"

export default function Fullchart() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const navigate = useNavigate()
  const [pageNumber, setPagenumber] = useState(1)
  const { Serial, deviceId, expand, cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token, hosName, hosImg, userLevel } = cookieDecode
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })
  const [logData, setLogData] = useState<logtype[]>([])
  const [devData, setDevData] = useState<devicesType>()
  const { state } = useLocation()
  const { tempMin, tempMax } = state
  const canvasChartRef = useRef<HTMLDivElement | null>(null)
  const tableInfoRef = useRef<HTMLDivElement | null>(null)
  const [validationData, setValidationData] = useState<wardsType>()
  const [isloading, setIsLoading] = useState(false)

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const fetchWard = async () => {
    try {
      const response = await axios.get<responseType<wardsType>>(`${import.meta.env.VITE_APP_API}/ward/${devData?.wardId}`, { headers: { authorization: `Bearer ${token}` } })
      setValidationData(response.data.data)
    } catch (error) { //up
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

  const Logday = async () => {
    setPagenumber(1)
    setLogData([])
    try {
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=day&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setLogData(responseData.data.data)
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

  const Logweek = async () => {
    setPagenumber(2)
    setLogData([])
    try {
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=week&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setLogData(responseData.data.data)
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

  const Logmonth = async () => {
    setPagenumber(3)
    setLogData([])
    try {
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=month&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      setLogData(responseData.data.data)
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

  const Logcustom = async () => {
    const { endDate, startDate } = filterDate
    let startDateNew = new Date(filterDate.startDate)
    let endDateNew = new Date(filterDate.endDate)
    let timeDiff = Math.abs(endDateNew.getTime() - startDateNew.getTime())
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    if (startDate !== '' && endDate !== '') {
      if (diffDays <= 31) {
        try {
          setLogData([])
          const responseData = await axios
            .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=${filterDate.startDate},${filterDate.endDate}&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
              headers: { authorization: `Bearer ${token}` }
            })
          setLogData(responseData.data.data)
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
    if (String(deviceId) !== 'undefined' && token) fetchData()
  }, [pageNumber, token, deviceId])

  useEffect(() => {
    if (token) {
      Logday()
    }
  }, [token])

  const exportChart = () => {
    setIsLoading(true);
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

  const handleShowEdit = () => {
    const newArray: logtype[] = logData.map(items => {
      const tempMax = items.device.probe[0]?.tempMax
      const tempMin = items.device.probe[0]?.tempMin

      if (tempMax !== undefined && items.tempAvg >= tempMax) {
        return {
          ...items,
          tempAvg: Math.floor(Math.random() * (tempMax - (tempMax) + 1) + (tempMax - 1))
        }
      } else if (tempMin !== undefined && items.tempAvg <= tempMin) {
        return {
          ...items,
          tempAvg: Math.floor(Math.random() * ((tempMin) - tempMin + 1) + tempMin)
        }
      } else {
        return items
      }
    })
    setLogData(newArray)
  }


  return (
    <Container fluid>
        <Breadcrumbs className="mt-3"
          separator={<RiArrowRightSLine fontSize={20} />}
        >
          <Link to={'/dashboard'}>
            <RiDashboardFill fontSize={20} />
          </Link>
          <Typography color="text.primary">{t('pageChart')}</Typography>
        </Breadcrumbs>
        <FullchartHead>
          <FullchartHeadLeft>
            <FullchartHeadBtn $primary={pageNumber === 1} onClick={Logday}>{t('chartDay')}</FullchartHeadBtn>
            <FullchartHeadBtn $primary={pageNumber === 2} onClick={Logweek}>{t('chartWeek')}</FullchartHeadBtn>
            <FullchartHeadBtn $primary={pageNumber === 3} onClick={Logmonth}>{t('month')}</FullchartHeadBtn>
            <FullchartHeadBtn $primary={pageNumber === 4} onClick={() => { setPagenumber(4) }}>{t('chartCustom')}</FullchartHeadBtn>
            <span>|</span>
            <FullcharComparetHeadBtn onClick={() => navigate('compare')}>{t('chartCompare')}</FullcharComparetHeadBtn>
          </FullchartHeadLeft>
          <ExportandAuditFlex>
            {
              userLevel !== '3' && <AuditGraphBtn onClick={() => {
                if (logData) {
                  swalOptimizeChartButtons
                    .fire({
                      title: t('alertHeaderWarning'),
                      html: t('optimizeChartText'),
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: t('continueButton'),
                      cancelButtonText: t('closeDialogButton'),
                      reverseButtons: false,
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                        handleShowEdit()
                      }
                    })
                } else {
                  toast.error("Data not found")
                }
              }}>
                <BsStars />
                {t('optimizeGraph')}
              </AuditGraphBtn>
            }
            <Dropdown>
              <Dropdown.Toggle variant="0" className="border-0 p-0">
                <FullchartHeadExport>
                  <RiFolderSharedLine />
                  {t('exportFile')}
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
                  if (logData.length > 0) {
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
                          tempMin: tempMin,
                          tempMax: tempMax
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
        </FullchartHead>
        <FullchartBody $primary={pageNumber !== 4}>
          <CustomChart>
            {pageNumber === 4 &&
              <FilterContainer>
                <Form.Control
                  type="date"
                  min={devData?.dateInstall.split('T')[0]}
                  max={filterDate.endDate !== '' ? filterDate.endDate : getDateNow()}
                  value={filterDate.startDate}
                  onChange={(e) => setFilterDate({ ...filterDate, startDate: e.target.value })} />
                <Form.Control
                  type="date"
                  min={filterDate.startDate}
                  max={getDateNow()}
                  value={filterDate.endDate}
                  onChange={(e) => setFilterDate({ ...filterDate, endDate: e.target.value })} />
                <FilterSearchBtn onClick={Logcustom}>{t('searchButton')}</FilterSearchBtn>
              </FilterContainer>}
            {
              logData.length > 0 ?
                <FullchartBodyChartCon $primary={expand} ref={canvasChartRef}>
                  <TableInfoDevice ref={tableInfoRef}>
                    <h4>{hosName}</h4>
                    <span>{devData?.devDetail ? devData?.devDetail : '--'} | {devData?.devSerial}</span>
                    <span>{devData?.locInstall ? devData?.locInstall : '- -'}</span>
                  </TableInfoDevice>
                  <Apexchart
                    chartData={logData}
                    devicesData={{
                      tempMin,
                      tempMax
                    }}
                    tempHeight={680}
                    tempWidth={1480}
                  />
                </FullchartBodyChartCon>
                :
                <PageLoading reset={pageNumber} />
            }
          </CustomChart>
        </FullchartBody>
        {isloading && <WaitExportImage>
          <Loading loading={true} title={t('loading')} icn={<RiLoader2Line fill="white" />} />
        </WaitExportImage>}
    </Container>
  )
}
