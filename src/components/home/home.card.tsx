import { Dispatch, SetStateAction, useMemo } from "react"
import { devicesType } from "../../types/device.type"
import { useTranslation } from "react-i18next"
import {
  RiDoorClosedLine,
  RiFolderSettingsLine,
  RiListSettingsLine,
  RiPlugLine,
  RiSdCardMiniLine,
  RiShieldCheckLine,
  RiSignalWifi1Line,
  RiTempColdLine,
} from "react-icons/ri"
import { notificationType } from "../../types/notification.type"
import { CountStyle, HomeCardItem } from "../../style/components/home.styled"
import { RootState } from "../../stores/store"
import { useSelector } from "react-redux"

type HomeCardData = {
  deviceData: devicesType[]
  wardId: string
  cardActive: string
  setCardActive: Dispatch<SetStateAction<string>>
  setOnFilteres: Dispatch<SetStateAction<boolean>>
}

function HomeCard({ cardActive, deviceData, wardId, setCardActive, setOnFilteres }: HomeCardData) {
  const { t } = useTranslation()
  const { hosId, cookieDecode } = useSelector((state: RootState) => state.utilsState)
  const hId = cookieDecode.hosId

  let filter = useMemo(() => {
    return wardId !== ''
      ? deviceData.filter((item) => item.wardId.includes(wardId))
      : deviceData.filter((item) => hosId ? item.ward.hospital.hosId.includes(hosId) : item)
  }, [wardId, deviceData, hosId, hId])

  const getSum = (key: keyof NonNullable<devicesType['_count']>) =>
    filter.reduce((acc, devItems) => acc + (devItems._count?.[key] ?? 0), 0)

  const getFilteredCount = (predicate: (n: notificationType) => boolean) =>
    filter.flatMap(i => i.noti).filter(predicate).length

  const countState = {
    temp: getFilteredCount(n => ['LOWER', 'OVER'].includes(n.notiDetail.split('/')[1])),
    door: getFilteredCount(n => n.notiDetail.startsWith('PROBE') && n.notiDetail.split('/')[2].startsWith('ON')),
    connect: getSum('log'),
    plug: getFilteredCount(n => n.notiDetail.split('/')[0] === 'AC'),
    scCard: getFilteredCount(n => n.notiDetail.split('/')[0] === 'SD'),
    adjust: getSum('history'),
    repair: getSum('repair'),
    warranties: getSum('warranty'),
  }

  const cardItems = [
    { key: '1', label: t('countProbe'), count: countState.temp, icon: <RiTempColdLine /> },
    { key: '2', label: t('countDoor'), count: countState.door, icon: <RiDoorClosedLine /> },
    { key: '3', label: t('countConnect'), count: countState.connect, icon: <RiSignalWifi1Line /> },
    { key: '4', label: t('countPlug'), count: countState.plug, icon: <RiPlugLine /> },
    { key: '5', label: t('countSdCard'), count: countState.scCard, icon: <RiSdCardMiniLine /> },
    { key: '6', label: t('countAdjust'), count: countState.adjust, icon: <RiListSettingsLine /> },
    { key: '7', label: t('countRepair'), count: countState.repair, icon: <RiFolderSettingsLine /> },
    { key: '8', label: t('countWarranty'), count: countState.warranties, icon: <RiShieldCheckLine /> },
  ]

  const handleCardClick = (key: string) => {
    if (cardActive === key) {
      setCardActive('')
      setOnFilteres(false)
    } else {
      setCardActive(key)
      setOnFilteres(true)
    }
  }


  return (
    <>
      {cardItems.map(({ key, label, count, icon }) => (
        <HomeCardItem
          key={key}
          $primary={cardActive === key}
          onClick={() => handleCardClick(key)}
        >
          <span>{label}</span>
          <CountStyle $primary={count > 0}>{count}</CountStyle>
          <div>
            <span>{t('countNormalUnit')}</span>
            {icon}
          </div>
        </HomeCardItem>
      ))}
    </>
  )
}

export default HomeCard
