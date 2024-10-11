import { wardsType } from "../../types/ward.type"
import { dropDownWardProp } from "../../types/prop.type"
import { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { responseType } from "../../types/response.type"
import { hospitalsType } from "../../types/hospital.type"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import Select, { SingleValue } from 'react-select'
import { useTheme } from "../../theme/ThemeProvider"

type Option = {
  value: string,
  label: string,
}

type Ward = {
  wardId: string,
  wardName: string,
}

export default function WardDropdown(DwardProp: dropDownWardProp) {
  const { t } = useTranslation()
  const { groupId, Hosid, setStateWard } = DwardProp
  const [wardData, setWardData] = useState<wardsType[]>([])
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const { theme } = useTheme()

  const setWardId = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setStateWard(selectedValue)
  }

  const fetchHospital = async () => {
    if (Hosid !== "" || groupId !== "" && !groupId) {
      const url: string = `${import.meta.env.VITE_APP_API}/hospital/${Hosid}`
      try {
        const response = await axios.get<responseType<hospitalsType>>(url, {
          headers: { authorization: `Bearer ${token}` }
        })
        setWardData(response.data.data.ward)
        // setStateWard(response.data.data.ward[0]?.wardId)
      } catch (error) { //up
        if (error instanceof AxiosError) {
          console.error(error.response?.data.message)
        } else {
          console.error('Unknown Error', error)
        }
      }
    }
  }

  useEffect(() => {
    fetchHospital()
  }, [Hosid])

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
        wardData.length > 0 &&
        <Select
          options={mapOptions<Ward, keyof Ward>(wardData, 'wardId', 'wardName')}
          defaultValue={mapDefaultValue<Ward, keyof Ward>(wardData, String(groupId), 'wardId', 'wardName')}
          onChange={setWardId}
          autoFocus={false}
          isDisabled={Hosid !== "" ? false : true}
          placeholder={t('selectWard')}
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
