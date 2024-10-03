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
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { setDeviceId, setSerial } from "../../stores/utilsStateSlice"
import { AsyncThunk } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { storeDispatchType } from "../../stores/store"
import ModalAdjust from "./modal.adjust"
import { cookieOptions, cookies } from "../../constants/constants"
import { logtype } from "../../types/log.type"

type DevicesInfoCard = {
  devicesdata: devicesType,
  keyindex: number,
  fetchData: AsyncThunk<devicesType[], string, object>,
  onFilter: boolean
}

export default function DevicesInfoCard(DevicesInfoCard: DevicesInfoCard) {
  const { devicesdata, fetchData, onFilter } = DevicesInfoCard
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const openDashboard = (data: {
    devid: string,
    devsn: string
  }) => {
    if (devicesdata.log.length === 0) {
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

  const openmodal = () => {
    setShow(true)
  }

  return (
    <>
      <DeviceCard>
        <DeviceCardHead>
          <CardHomeFlex>
            <DeviceCardHeadImg
              src={devicesdata.locPic ? `${import.meta.env.VITE_APP_IMG}${devicesdata.locPic}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`}
              alt="device-picture"
              $primary={devicesdata.locPic ? true : false}
              loading="lazy" />
          </CardHomeFlex>
          <DeviceCardHeadStatus>
            <DeviceCardHeadHandle>
              <CardDevBtn onClick={() => openDashboard({
                devid: devicesdata.devId,
                devsn: devicesdata.devSerial
              })}>
                <RiDashboardLine />
                <TooltipSpan>
                  {t('deviceToolDashboard')}
                </TooltipSpan>
              </CardDevBtn>
              <CardDevBtn onClick={openmodal}>
                <RiSettings3Line />
                <TooltipSpan>
                  {t('deviceToolAdjust')}
                </TooltipSpan>
              </CardDevBtn>
            </DeviceCardHeadHandle>
            <DeviceStateNetwork $primary={devicesdata.backupStatus === '0'}>
              {
                !onFilter ?
                  devicesdata.backupStatus === '0' ? t('deviceOffline') : t('deviceOnline')
                  :
                  <div>
                    {`${devicesdata._count?.log} ${t('countNormalUnit')}`}
                  </div>
              }
            </DeviceStateNetwork>
          </DeviceCardHeadStatus>
        </DeviceCardHead>
        <DeviceCardBody>
          <h5>{devicesdata.devDetail ? devicesdata.devDetail : '- -'}</h5>
          <span>{devicesdata.devSerial}</span>
          <span title={devicesdata.locInstall ? devicesdata.locInstall : '- -'}>{devicesdata.locInstall ? devicesdata.locInstall : '- -'}</span>
        </DeviceCardBody>
        <DeviceCardFooter>
          {
            !onFilter ?
              <DeviceCardFooterDoorFlex>
                {Array.from({ length: devicesdata.probe[0]?.door || 1 }, (_, index) => {
                  const doorKey = `door${index + 1}` as keyof logtype
                  const doorLog = devicesdata.log[0]?.[doorKey] === "1"
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
                <span>{`${devicesdata.noti.filter((n) => n.notiDetail.split('/')[0].substring(0, 5) === 'PROBE' && n.notiDetail.split('/')[2].substring(0, 5) === 'ON').length} ${t('countNormalUnit')}`}</span>
              </CardDoorSection>
          }
          <DeviceCardFooterTemp>
            <DeviceCardFooterTempT>
              {devicesdata.log[0]?.tempAvg.toFixed(2) || '- -'}
              <sub>°C</sub>
              <TooltipSpan>
                {t('deviceTemp')}
              </TooltipSpan>
            </DeviceCardFooterTempT>
            <DeviceCardFooterTempT>
              {devicesdata.log[0]?.humidityAvg.toFixed(2) || '- -'}
              <sub>%</sub>
              <TooltipSpan>
                {t('deviceHumi')}
              </TooltipSpan>
            </DeviceCardFooterTempT>
            <DeviceCardFooterTempT>
              {devicesdata.log[0]?.sendTime.substring(11, 16) || '- -'}
              <TooltipSpan>
                {t('deviceTime')}
              </TooltipSpan>
            </DeviceCardFooterTempT>
          </DeviceCardFooterTemp>
          <DeviceCardFooterI>
            <DeviceCardFooterInfo
              $primary={
                devicesdata.log[0]?.tempAvg >= devicesdata.probe[0]?.tempMax ||
                devicesdata.log[0]?.tempAvg <= devicesdata.probe[0]?.tempMin
              }
              $onFilter={onFilter}
            >
              {
                !onFilter ?
                  devicesdata.log[0]?.tempAvg >= devicesdata.probe[0]?.tempMax ||
                    devicesdata.log[0]?.tempAvg <= devicesdata.probe[0]?.tempMin ?
                    <RiErrorWarningLine />
                    :
                    <RiTempColdLine />
                  :
                  <div>
                    <span>{`${devicesdata.noti.filter((n) => n.notiDetail.split('/')[1] === 'LOWER' || n.notiDetail.split('/')[1] === 'OVER').length}`}</span>
                    <RiErrorWarningLine size={16} />
                  </div>
              }
              <TooltipSpan>
                {t('deviceProbe')}
              </TooltipSpan>
            </DeviceCardFooterInfo>
            <DeviceCardFooterInfo $primary={
              devicesdata.log[0]?.ac === '1'
            }
              $onFilter={onFilter}
            >
              {
                !onFilter ?
                  <RiPlugLine />
                  :
                  <div>
                    <span>{`${devicesdata.noti.filter((n) => n.notiDetail.split('/')[0] === 'AC').length}`}</span>
                    <RiPlugLine size={16} />
                  </div>
              }
              <TooltipSpan>
                {t('devicePlug')}
              </TooltipSpan>
            </DeviceCardFooterInfo>
            <DeviceCardFooterInfo $primary={
              devicesdata.log[0]?.sdCard === "1"
            }
              $onFilter={onFilter}
            >
              {
                !onFilter ?
                  <RiSdCardMiniLine />
                  :
                  <div>
                    <span>{`${devicesdata.noti.filter((n) => n.notiDetail.split('/')[0] === 'SD').length}`}</span>
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
                    <span>{devicesdata.log[0]?.battery && devicesdata.log[0]?.battery + '%' || '- -'}</span>
                  </>
                  :
                  <div>
                    <span>{devicesdata.log[0]?.battery && devicesdata.log[0]?.battery + '%' || '- -'}</span>
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
      <ModalAdjust
        fetchData={fetchData}
        devicesdata={devicesdata}
        show={show}
        setShow={setShow}
      />
    </>
  )
}
