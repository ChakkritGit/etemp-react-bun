import {
  CardDevBtn,
  CardDoorSection,
  CardHomeFlex,
  DeviceCard, DeviceCardBody, DeviceCardFooter, DeviceCardFooterDoor,
  DeviceCardFooterDoorFlex, DeviceCardFooterI, DeviceCardFooterInfo, DeviceCardFooterTemp,
  DeviceCardFooterTempT, DeviceCardHead, DeviceCardHeadHandle, DeviceCardHeadImg,
  DeviceCardHeadStatus, DeviceStateNetwork, TooltipSpan
} from "../../style/style"
import {
  RiBatteryChargeLine,
  RiDashboardLine, RiDoorClosedLine, RiDoorOpenLine, RiErrorWarningLine,
  RiPlugLine, RiSdCardMiniLine, RiSettings3Line, RiTempColdLine
} from "react-icons/ri"
import { devicesType } from "../../types/device.type"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { setDeviceId, setSerial } from "../../stores/utilsStateSlice"
import { useDispatch } from "react-redux"
import { storeDispatchType } from "../../stores/store"
import { cookieOptions, cookies } from "../../constants/constants"
import { logtype } from "../../types/log.type"
import { Dispatch, SetStateAction } from "react"

type DevicesInfoCard = {
  devicesdata: devicesType,
  onFilter: boolean,
  setDeviceData: Dispatch<SetStateAction<devicesType | null>>,
  setShow: Dispatch<SetStateAction<boolean>>
}

export default function DevicesInfoCard(DevicesInfoCard: DevicesInfoCard) {
  const { devicesdata, onFilter, setDeviceData, setShow } = DevicesInfoCard
  const { backupStatus, devDetail, devId, devSerial, locInstall, locPic, log, noti, probe, _count } = devicesdata
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const navigate = useNavigate()

  const openDashboard = (data: {
    devid: string,
    devsn: string
  }) => {
    if (log.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No data",
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      dispatch(setDeviceId(data.devid))
      dispatch(setSerial(data.devsn))
      cookies.set('devid', data.devid, cookieOptions)
      cookies.set('devSerial', data.devsn, cookieOptions)
      navigate('/dashboard')
      window.scrollTo(0, 0)
    }
  }

  const openmodal = (deviceData: devicesType) => {
    setDeviceData(deviceData)
    setShow(true)
  }

  return (
    <>
      <DeviceCard>
        <DeviceCardHead>
          <CardHomeFlex>
            <DeviceCardHeadImg
              src={locPic ? `${import.meta.env.VITE_APP_IMG}${locPic}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`}
              alt="device-picture"
              $primary={locPic ? true : false}
              loading="lazy" />
          </CardHomeFlex>
          <DeviceCardHeadStatus>
            <DeviceCardHeadHandle>
              <CardDevBtn onClick={() => openDashboard({
                devid: devId,
                devsn: devSerial
              })}>
                <RiDashboardLine />
                <TooltipSpan>
                  {t('deviceToolDashboard')}
                </TooltipSpan>
              </CardDevBtn>
              <CardDevBtn onClick={() => openmodal(devicesdata)}>
                <RiSettings3Line />
                <TooltipSpan>
                  {t('deviceToolAdjust')}
                </TooltipSpan>
              </CardDevBtn>
            </DeviceCardHeadHandle>
            <DeviceStateNetwork $primary={backupStatus === '0'}>
              {
                !onFilter ?
                  backupStatus === '0' ? t('deviceOffline') : t('deviceOnline')
                  :
                  <div>
                    {`${_count?.log} ${t('countNormalUnit')}`}
                  </div>
              }
            </DeviceStateNetwork>
          </DeviceCardHeadStatus>
        </DeviceCardHead>
        <DeviceCardBody>
          <h5>{devDetail && devDetail !== null && devDetail !== "null" ? devDetail : '- -'}</h5>
          <span>{devSerial}</span>
          <span title={locInstall && locInstall !== null && locInstall !== "null" ? locInstall : '- -'}>{locInstall && locInstall !== null && locInstall !== "null" ? locInstall : '- -'}</span>
        </DeviceCardBody>
        <DeviceCardFooter>
          {
            !onFilter ?
              <DeviceCardFooterDoorFlex>
                {Array.from({ length: probe[0]?.door || 1 }, (_, index) => {
                  const doorKey = `door${index + 1}` as keyof logtype
                  const doorLog = log[0]?.[doorKey] === "1"
                  return (
                    <DeviceCardFooterDoor key={index} $primary={doorLog}>
                      {doorLog ? <RiDoorOpenLine /> : <RiDoorClosedLine />}
                    </DeviceCardFooterDoor>
                  )
                })}
                <TooltipSpan>
                  {t('deviceDoor')}
                </TooltipSpan>
              </DeviceCardFooterDoorFlex>
              :
              <CardDoorSection>
                <RiDoorOpenLine size={16} />
                <span>{`${noti.filter((n) => n.notiDetail.split('/')[0].substring(0, 5) === 'PROBE' && n.notiDetail.split('/')[2].substring(0, 5) === 'ON').length} ${t('countNormalUnit')}`}</span>
              </CardDoorSection>
          }
          <DeviceCardFooterTemp>
            <DeviceCardFooterTempT>
              {log[0]?.tempAvg.toFixed(2) || '- -'}
              <sub>°C</sub>
              <TooltipSpan>
                {t('deviceTemp')}
              </TooltipSpan>
            </DeviceCardFooterTempT>
            <DeviceCardFooterTempT>
              {log[0]?.humidityAvg.toFixed(2) || '- -'}
              <sub>%</sub>
              <TooltipSpan>
                {t('deviceHumi')}
              </TooltipSpan>
            </DeviceCardFooterTempT>
            <DeviceCardFooterTempT>
              {log[0]?.sendTime.substring(11, 16) || '- -'}
              <TooltipSpan>
                {t('deviceTime')}
              </TooltipSpan>
            </DeviceCardFooterTempT>
          </DeviceCardFooterTemp>
          <DeviceCardFooterI>
            <DeviceCardFooterInfo
              $primary={
                log[0]?.tempAvg >= probe[0]?.tempMax ||
                log[0]?.tempAvg <= probe[0]?.tempMin
              }
              $onFilter={onFilter}
            >
              {
                !onFilter ?
                  log[0]?.tempAvg >= probe[0]?.tempMax ||
                    log[0]?.tempAvg <= probe[0]?.tempMin ?
                    <RiErrorWarningLine />
                    :
                    <RiTempColdLine />
                  :
                  <div>
                    <span>{`${noti.filter((n) => n.notiDetail.split('/')[1] === 'LOWER' || n.notiDetail.split('/')[1] === 'OVER').length}`}</span>
                    <RiErrorWarningLine size={16} />
                  </div>
              }
              <TooltipSpan>
                {t('deviceProbe')}
              </TooltipSpan>
            </DeviceCardFooterInfo>
            <DeviceCardFooterInfo $primary={
              log[0]?.ac === '1'
            }
              $onFilter={onFilter}
            >
              {
                !onFilter ?
                  <RiPlugLine />
                  :
                  <div>
                    <span>{`${noti.filter((n) => n.notiDetail.split('/')[0] === 'AC').length}`}</span>
                    <RiPlugLine size={16} />
                  </div>
              }
              <TooltipSpan>
                {t('devicePlug')}
              </TooltipSpan>
            </DeviceCardFooterInfo>
            <DeviceCardFooterInfo $primary={
              log[0]?.sdCard === "1"
            }
              $onFilter={onFilter}
            >
              {
                !onFilter ?
                  <RiSdCardMiniLine />
                  :
                  <div>
                    <span>{`${noti.filter((n) => n.notiDetail.split('/')[0] === 'SD').length}`}</span>
                    <RiSdCardMiniLine size={16} />
                  </div>
              }
              <TooltipSpan>
                {t('deviceSdCard')}
              </TooltipSpan>
            </DeviceCardFooterInfo>
            <DeviceCardFooterInfo
              $onFilter={onFilter}
            >
              {
                !onFilter ?
                  <>
                    <RiBatteryChargeLine />
                    <span>{log[0]?.battery && log[0]?.battery + '%' || '- -'}</span>
                  </>
                  :
                  <div>
                    <span>{log[0]?.battery && log[0]?.battery + '%' || '- -'}</span>
                    <RiBatteryChargeLine size={16} />
                  </div>
              }
              <TooltipSpan>
                {t('deviceBattery')}
              </TooltipSpan>
            </DeviceCardFooterInfo>
          </DeviceCardFooterI>
        </DeviceCardFooter>
      </DeviceCard>
    </>
  )
}
