import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { devicesType } from "../../types/device.type"
import axios, { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import Select, { SingleValue } from 'react-select'
import { useTheme } from "../../theme/ThemeProvider"

type sntype = {
  setRepairdata: Dispatch<SetStateAction<{
    repairInfo: string,
    repairLocation: string,
    telePhone: string,
    ward: string,
    devId: string,
    warrantyStatus: string,
    comment: string,
    repairDetails: string,
    repairStatus: string,
    repairInfo1: string,
    repairInfo2: string
  }>>
  repairData: {
    repairInfo: string,
    repairLocation: string,
    telePhone: string,
    ward: string,
    devId: string,
    warrantyStatus: string,
    comment: string,
    repairDetails: string,
    repairStatus: string,
    repairInfo1: string,
    repairInfo2: string
  }
  devIdkey: string
}

type Option = {
  value: string,
  label: string,
}

type RepairOption = {
  devId: string,
  devSerial: string,
}

export default function Showsn(sntype: sntype) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [devData, setDevData] = useState<devicesType[]>([])
  const [selectedval, setSelectedVal] = useState(sntype.devIdkey ?? '')
  const { theme } = useTheme()

  const setDevId = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    sntype.setRepairdata({ ...sntype.repairData, devId: selectedValue })
    setSelectedVal(selectedValue)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url: string = `${import.meta.env.VITE_APP_API}/device`
        const response = await axios
          .get(url, {
            headers: { authorization: `Bearer ${token}` }
          })
        setDevData(response.data.data)
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
    fetchData()
  }, [])

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

  return (
    <>
      {
        devData.length > 0 &&
        <Select
          options={mapOptions<RepairOption, keyof RepairOption>(devData, 'devId', 'devSerial')}
          value={mapDefaultValue<RepairOption, keyof RepairOption>(devData, selectedval, 'devId', 'devSerial')}
          onChange={setDevId}
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
      }
    </>
  )
}
