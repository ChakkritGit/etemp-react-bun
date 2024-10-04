import { Container } from "react-bootstrap"
import { CardUserBody, CardUserHead, PaginitionContainer } from "../../style/style"
import { useTranslation } from "react-i18next"
import { ChangeEvent, useEffect, useState } from "react"
import CardUser from "../../components/users/cardUser"
import { usersType } from "../../types/user.type"
import Adduser from "./adduser"
import Paginition from "../../components/filter/paginition"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UserState, UtilsStateStore } from "../../types/redux.type"
import { setSearchQuery } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import { paginationCardUsers } from "../../constants/constants"
import FilterHosAndWard from "../../components/dropdown/filter.hos.ward"

export default function Permission() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { userData } = useSelector<DeviceStateStore, UserState>((state) => state.user)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [cardsPerPage, setCardsPerPage] = useState<number>(50)
  const [displayedCards, setDisplayedCards] = useState<usersType[]>(userData ? userData.slice(0, cardsPerPage) : [])
  const { searchQuery, expand, tokenDecode, hosId, wardId } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { userId } = tokenDecode
  // Filter Data
  const filteredItems = wardId !== '' ? userData.filter(item => item.wardId.toLowerCase().includes(wardId.toLowerCase())) : userData
  const totalPages = Math.ceil(filteredItems.length / cardsPerPage)

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

  return (
    <Container fluid>
      <CardUserHead>
        <div>
          <h3>{t('sidePermission')}</h3>
          <div>
            <FilterHosAndWard />
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
