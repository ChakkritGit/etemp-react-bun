import { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { setDeviceId, setSerial } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import { setDefaultLogs } from "../../stores/LogsSlice"
import { devicesType } from "../../types/device.type"
import { cookieOptions, cookies } from "../../constants/constants"
import Select, { SingleValue } from 'react-select'
import { useTranslation } from "react-i18next"
import { useTheme } from "../../theme/ThemeProvider"

type Option = {
  value: string,
  label: string,
}

type Device = {
  wardId: string,
  devId: string,
  devSerial: string,
  devDetail: string,
}

export default function Dropdown() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { deviceId, Serial, wardId } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const [val, setVal] = useState(`${deviceId}-${Serial}`)
  const { theme } = useTheme()

  const selectchang = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    const newDeviceId = selectedValue.substring(0, 40)
    const newSerial = selectedValue.substring(41)
    if (Serial === newSerial) return
    setVal(selectedValue)
    dispatch(setDefaultLogs({} as devicesType))
    cookies.set('devid', newDeviceId, cookieOptions)
    cookies.set('devSerial', newSerial, cookieOptions)
    dispatch(setDeviceId(newDeviceId))
    dispatch(setSerial(newSerial))
  }

  const mapOptions = <T, K extends keyof T>(data: T[], valueKey: K, valueKey2: K, labelKey: K): Option[] =>
    data.map(item => ({
      value: `${item[valueKey]}-${item[valueKey2]}` as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, valueKey2: K, labelKey: K): Option | undefined =>
    data.filter(item => `${item[valueKey]}-${item[valueKey2]}` === id).map(item => ({
      value: `${item[valueKey]}-${item[valueKey2]}` as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

  let filteredDevicesList = useMemo(() => {
    return wardId !== ''
      ? devices.filter((item) => item.wardId.toLowerCase().includes(wardId.toLowerCase()))
      : devices;
  }, [wardId, devices])

  return (
    <Select
      options={mapOptions<Device, keyof Device>(filteredDevicesList, 'devId', 'devSerial', 'devDetail')}
      value={mapDefaultValue<Device, keyof Device>(filteredDevicesList, val, 'devId', 'devSerial', 'devDetail')}
      onChange={selectchang}
      autoFocus={false}
      placeholder={t('selectDeviceDrop')}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
          borderRadius: "var(--border-radius-big)"
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
  )
}
