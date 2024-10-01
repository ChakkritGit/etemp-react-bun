import { Container } from "react-bootstrap"
import { CardUserBody, CardUserHead, DeviceInfoSpan, DeviceInfoSpanClose, PaginitionContainer } from "../../style/style"
import { useTranslation } from "react-i18next"
import { ChangeEvent, useEffect, useState } from "react"
import CardUser from "../../components/users/cardUser"
import { usersType } from "../../types/user.type"
import Adduser from "./adduser"
import Paginition from "../../components/filter/paginition"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UserState, UtilsStateStore } from "../../types/redux.type"
import { setHosId, setSearchQuery, setWardId } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import Select from "react-select"
import { RiCloseLine, RiFilter3Line } from "react-icons/ri"
import { useTheme } from "../../theme/ThemeProvider"
import { cookieOptions, cookies, paginationCardUsers } from "../../constants/constants"
import { wardsType } from "../../types/ward.type"
import { hospitalsType } from "../../types/hospital.type"

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

export default function Permission() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { userData } = useSelector<DeviceStateStore, UserState>((state) => state.user)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [cardsPerPage, setCardsPerPage] = useState<number>(50)
  const [displayedCards, setDisplayedCards] = useState<usersType[]>(userData ? userData.slice(0, cardsPerPage) : [])
  const { searchQuery, expand, tokenDecode, cookieDecode, hosId, wardId } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const hospitalsData = useSelector<DeviceStateStore, hospitalsType[]>((state) => state.arraySlice.hospital.hospitalsData)
  const wardData = useSelector<DeviceStateStore, wardsType[]>((state) => state.arraySlice.ward.wardData)
  const { userLevel, groupId } = cookieDecode
  const { userId } = tokenDecode
  const { theme } = useTheme()
  const [filterdata, setFilterdata] = useState(false)
  const [wardName, setWardname] = useState<wardsType[]>([])
  // Filter Data
  const filteredItems = wardId !== '' ? userData.filter(item => item.wardId.toLowerCase().includes(wardId.toLowerCase())) : userData
  const totalPages = Math.ceil(filteredItems.length / cardsPerPage)

  const allWard = { wardId: '', wardName: 'ALL', wardSeq: 0, hosId: '', createAt: '', updateAt: '', hospital: {} as hospitalsType }

  const updatedWardData = [allWard, ...wardName]

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  useEffect(() => {
    if (filteredItems.length > 0) {
      setDisplayedCards(filteredItems.slice(0, cardsPerPage))
    } else {
      setDisplayedCards(userData)
    }
    showPage(0, searchQuery)
  }, [searchQuery, cardsPerPage, wardId, hosId, userData])

  useEffect(() => {
    showPage(currentPage, searchQuery)
  }, [currentPage, cardsPerPage])

  const showPage = (pageNumber: number, query: string = '') => {
    const startIndex = pageNumber * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    const filteredCards = filteredItems ? (query ? filteredItems.filter(card => [card.displayName, card.userName, card.userId].some(attr => attr.toLowerCase().includes(query.toLowerCase()))) : filteredItems) : []
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
  }

  const updateLocalStorageAndDispatch = (key: string, id: string | undefined, action: Function) => {
    cookies.set(key, String(id), cookieOptions)
    dispatch(action(String(id)))
  }

  const getHospital = (hospitalID: string | undefined) => {
    updateLocalStorageAndDispatch('selectHos', hospitalID, setHosId)
    setWardname(wardData.filter((items) => items.hospital.hosId === hospitalID))
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
    <Container fluid>
      <CardUserHead>
        <div>
          <h3>{t('sidePermission')}</h3>
          <div>
            {!filterdata &&
              <DeviceInfoSpan onClick={() => setFilterdata(true)}>
                {t('deviceFilter')}
                <RiFilter3Line />
              </DeviceInfoSpan>}
            {
              filterdata &&
              <div>
                {
                  userLevel !== '2' &&
                  <Select
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
                <DeviceInfoSpanClose onClick={() => setFilterdata(false)}>
                  <RiCloseLine />
                </DeviceInfoSpanClose>
              </div>
            }
            <Adduser pagestate={"add"} />
          </div>
        </div>
      </CardUserHead>
      <CardUserBody $primary={expand}>
        {
          displayedCards.filter((f) => f.userId !== userId).map((item, index) => (
            <CardUser
              key={item.userId}
              keyindex={index}
              userPic={item.userPic}
              displayName={item.displayName}
              userName={item.userName}
              userLevel={item.userLevel}
              userId={item.userId}
              hosId={item.ward.hosId}
              userStatus={item.userStatus}
              wardId={item.wardId}
            />
          ))
        }
      </CardUserBody>
      <PaginitionContainer>
        <div></div>
        <Paginition
          currentPage={currentPage}
          cardsPerPage={cardsPerPage}
          changePage={changePage}
          displaySelectDevices={displaySelectDevices}
          displayedCards={displayedCards}
          userdata={userData}
          totalPages={totalPages}
          pagPerpage={paginationCardUsers}
        />
      </PaginitionContainer>
    </Container >
  )
}
