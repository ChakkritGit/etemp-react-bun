import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { UtilsStateStore } from "../types/redux.type"
import { jwtToken, socketResponseType } from "../types/component.type"
import { cookies } from "../constants/constants"
import { CookieType } from "../types/cookie.type"
import { notificationType } from "../types/notification.type"

const initialState: UtilsStateStore = {
  deviceId: String(cookies.get('devid')),
  Serial: String(cookies.get('devSerial')),
  socketData: null,
  // deviceEvent: null,
  searchQuery: '',
  expand: localStorage.getItem('expandaside') === 'true',
  showAside: false,
  tokenDecode: {} as jwtToken,
  soundMode: localStorage.getItem('soundMode') === 'true',
  popUpMode: localStorage.getItem('popUpMode') === 'true',
  hosId: cookies.get('selectHos'),
  wardId: cookies.get('selectWard') ?? '',
  cookieEncode: cookies.get('localDataObject'),
  cookieDecode: false as unknown as CookieType,
  showAlert: false,
  notiData: [],
  reFetchData: false,
  onFilter: false
}

const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    setTokenDecode: (state, action: PayloadAction<jwtToken>) => {
      state.tokenDecode = action.payload
    },
    setDeviceId: (state, action: PayloadAction<string>) => {
      state.deviceId = action.payload
    },
    setSerial: (state, action: PayloadAction<string>) => {
      state.Serial = action.payload
    },
    setSocketData: (state, action: PayloadAction<socketResponseType | null>) => {
      state.socketData = action.payload
    },
    // setDeviceEvent: (state, action: PayloadAction<DeviceEventResponseType | null>) => {
    //   state.deviceEvent = action.payload
    // },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setExpand: (state, action: PayloadAction<boolean>) => {
      state.expand = action.payload
    },
    setShowAside: (state, action: PayloadAction<boolean>) => {
      state.showAside = action.payload
    },
    setSoundMode: (state, action: PayloadAction<boolean>) => {
      state.soundMode = action.payload
    },
    setPopUpMode: (state, action: PayloadAction<boolean>) => {
      state.popUpMode = action.payload
    },
    setHosId: (state, action: PayloadAction<string>) => {
      state.hosId = action.payload
    },
    setWardId: (state, action: PayloadAction<string>) => {
      state.wardId = action.payload
    },
    setCookieEncode: (state, action: PayloadAction<string>) => {
      state.cookieEncode = action.payload
    },
    setCookieDecode: (state, action: PayloadAction<CookieType>) => {
      state.cookieDecode = action.payload
    },
    setShowAlert: (state, action: PayloadAction<boolean>) => {
      state.showAlert = action.payload
    },
    setNotidata: (state, action: PayloadAction<notificationType[]>) => {
      state.notiData = action.payload
    },
    setRefetchdata: (state, action: PayloadAction<boolean>) => {
      state.reFetchData = action.payload
    },
    setOnFilter: (state, action: PayloadAction<boolean>) => {
      state.onFilter = action.payload
    },
  },
})

export const { setDeviceId, setSerial, setSocketData, setSearchQuery, setExpand, setShowAside, setNotidata,
  setTokenDecode, setSoundMode, setPopUpMode, setHosId, setWardId, setCookieEncode, setCookieDecode, setShowAlert, setRefetchdata, setOnFilter } = utilsSlice.actions

export default utilsSlice.reducer