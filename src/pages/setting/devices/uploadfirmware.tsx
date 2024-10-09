import { useTranslation } from "react-i18next"
import {
  DropContainer, DropHereFile, FileDroped, FileList, FirewareContent, FirmwareContainer,
  FirmwareHeader, ProgressBar, RowChildren, UploadButton
} from "../../../style/components/firmwareuoload"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { Form, Modal } from "react-bootstrap"
import { FormBtn, FormFlexBtn, ModalHead, PaginitionContainer } from "../../../style/style"
import {
  RiCloseCircleLine, RiCloseLine, RiCodeSSlashLine, RiDeleteBin2Line, RiDownloadCloud2Line,
  RiDownloadLine, RiDragDropLine, RiFileCheckLine, RiFileUploadLine
} from "react-icons/ri"
import { FileUploader } from "react-drag-drop-files"
import { CircularProgressbar } from 'react-circular-progressbar'
import { filesize } from "filesize"
import { responseType } from "../../../types/response.type"
import { Terminal } from "@xterm/xterm"
import { ESPLoader, FlashOptions, LoaderOptions, Transport } from "esptool-js"
import { useNavigate } from "react-router-dom"
import { firmwareType } from "../../../types/component.type"
import { swalWithBootstrapButtons } from "../../../components/dropdown/sweetalertLib"
import CryptoJS from "crypto-js"
import BinIco from "../../../assets/images/bin-icon.png"
import Swal from "sweetalert2"
import axios, { AxiosError } from "axios"
import Paginition from "../../../components/filter/paginition"
import toast from "react-hot-toast"
import TerminalComponent from "../../../components/settings/terminal"
import { storeDispatchType } from "../../../stores/store"
import { setSearchQuery, setShowAlert } from "../../../stores/utilsStateSlice"

interface FirmwareItem {
  fileName: string;
  fileSize: string;
  createDate: string;
}

const term = new Terminal({ cols: 150, rows: 40 })
term.options = {
  fontSize: 12,
  fontFamily: 'Courier New',
  cursorStyle: 'block',
  theme: {
    background: '#353535'
  }
}

const filters = [
  { usbVendorId: 0x10c4, usbProductId: 0xea60 }
]

let device: SerialPort
let esploader: ESPLoader
let transport: Transport

export default function Uploadfirmware() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const navigate = useNavigate()
  const { searchQuery, cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [show, setShow] = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [file, setFile] = useState<File | undefined>(undefined)
  const [dragChang, setDragChang] = useState<boolean>(false)
  const [progress, setProgress] = useState(0)
  const [submit, setSubmit] = useState(false)
  const [error, setError] = useState(false)
  const [dataFiles, setDataFile] = useState<firmwareType[]>([])
  const [fileData, setFileData] = useState<string | ArrayBuffer | null | undefined>(null)
  const [bootLoader, setBootLoader] = useState<string | ArrayBuffer | null | undefined>(null)
  const [parttition, setPartition] = useState<string | ArrayBuffer | null | undefined>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [flashProgress, setFlashProgress] = useState('0')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [cardsPerPage, setCardsPerPage] = useState<number>(10)
  const [displayedCards, setDisplayedCards] = useState<firmwareType[]>(dataFiles ? dataFiles.slice(0, cardsPerPage) : [])
  const fileTypes = ["BIN"]

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  useEffect(() => {
    if (terminalRef.current && showConsole) {
      term.open(terminalRef.current)
    }
  }, [showConsole])

  const fetchFiles = async () => {
    try {
      const response = await axios.get<responseType<firmwareType[]>>(`${import.meta.env.VITE_APP_API}/firmwares`, {
        headers: { authorization: `Bearer ${token}`, }
      })
      setDataFile(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      } else {
        Swal.fire({
          title: t('alertHeaderError'),
          text: 'Uknown Error',
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const openModalConsole = () => {
    setShowConsole(true)
  }

  const closeModalConsole = async () => {
    setShowConsole(false)
    term.clear()
    setDownloadProgress(0)
    setFlashProgress('0')
    await cleanUp()
  }

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setFile(undefined)
    setSubmit(false)
    setError(false)
    setProgress(0)
    setShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('fileupload', file as Blob)
    if (file) {
      try {
        setSubmit(true)
        const response = await axios.post<responseType<string>>(`${import.meta.env.VITE_APP_API}/firmwares`, formData, {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }, onUploadProgress: (progressEvent) => {
            const { progress } = progressEvent
            setProgress(Number(progress) * 100)
          }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        closeModal()
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setShowAlert(true))
          } else {
            Swal.fire({
              title: t('alertHeaderError'),
              text: error.response?.data.message,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            })
          }
          setError(true)
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: 'Uknown Error',
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
          setError(true)
        }
      } finally {
        fetchFiles()
      }
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('selectedFile'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const handleChange = (files: File) => {
    if (files) {
      setFile(undefined)
      setSubmit(false)
      setError(false)
      setFile(files)
    }
  }

  const handleDrag = (dragging: boolean) => {
    setDragChang(dragging)
    if (dragging) {
      setFile(undefined)
      setSubmit(false)
      setError(false)
    }
  }

  const handleError = (_error: string) => {
    Swal.fire({
      title: t('alertHeaderError'),
      text: t('uploadLabelNotSupport'),
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    })
  }

  const UploadJSXStyle = () => (
    <DropContainer $primary={file} $error={error}>
      {
        file ?
          <FileDroped $primary={submit} $error={error}>
            <div>
              {submit ?
                error ?
                  <RiCloseCircleLine size={128} />
                  :
                  <CircularProgressbar
                    value={progress}
                    text={`${progress.toFixed()}%`} />
                :
                <RiFileCheckLine size={128} />}
            </div>
            <div>
              <span>{file?.name}</span>
              <span>{filesize(file?.size, { standard: "jedec" })}</span>
            </div>
          </FileDroped>
          :
          !dragChang ? <DropHereFile>
            <div>
              <RiDragDropLine size={128} />
            </div>
            <span>{t('uploadLabel')}</span>
          </DropHereFile> : <></>
      }
    </DropContainer>
  )

  const getBootLoader = async () => {
    try {
      const bootloader = await axios.get<Blob>(`${import.meta.env.VITE_APP_API}/firmware/bootloader.bin`, {
        responseType: 'blob'
      })

      const file = new File([bootloader.data], 'bootloader.bin', { type: 'application/octet-stream' }); // สร้าง File object

      const reader = new FileReader()

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        setBootLoader(ev.target?.result)
      }

      reader.readAsBinaryString(file)
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

  const getPartition = async () => {
    try {
      const partition = await axios.get<Blob>(`${import.meta.env.VITE_APP_API}/firmware/partitions.bin`, {
        responseType: 'blob'
      })

      const file = new File([partition.data], 'partition.bin', { type: 'application/octet-stream' }); // สร้าง File object

      const reader = new FileReader()

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        setPartition(ev.target?.result)
      }

      reader.readAsBinaryString(file)
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

  useEffect(() => {
    if (downloadProgress > 0 && downloadProgress <= 99) {
      toast(`Downloading... ${downloadProgress.toFixed()}%`, {
        icon: <RiDownloadLine size={24} />,
      })
    } else if (downloadProgress === 100) {
      toast.success(`Downloaded ${downloadProgress.toFixed()}%`)
    }
  }, [downloadProgress])

  const downloadFw = async (fileName: string) => {
    try {
      const response = await axios.get<Blob>(`${import.meta.env.VITE_APP_API}/firmware/${fileName}`, {
        headers: { authorization: `Bearer ${token}`, },
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const { progress } = progressEvent
          setDownloadProgress(Number(progress) * 100)
        }
      })

      const file = new File([response.data], 'firmware.bin', { type: 'application/octet-stream' }); // สร้าง File object

      const reader = new FileReader()

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        setFileData(ev.target?.result)
      }

      reader.readAsBinaryString(file)
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
    } finally {
      openModalConsole()
    }
  }

  const deleteFw = async (fileName: string) => {
    try {
      const response = await axios.delete<responseType<firmwareType>>(`${import.meta.env.VITE_APP_API}/firmwares/${fileName}`, {
        headers: { authorization: `Bearer ${token}`, }
      })
      Swal.fire({
        title: t('alert_header_Success'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      } else {
        Swal.fire({
          title: t('alertHeaderError'),
          text: 'Uknown Error',
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    } finally {
      fetchFiles()
    }
  }

  const espLoaderTerminal = {
    clean() {
      term.clear()
    },
    writeLine(data: string | Uint8Array) {
      term.writeln(data)
    },
    write(data: string | Uint8Array) {
      term.write(data)
    },
  }

  useEffect(() => {
    if (fileData !== null && parttition !== null && bootLoader !== null) {
      programFunc()
    }
  }, [fileData, parttition, bootLoader])

  const programFunc = async () => {
    if (!device) {
      device = await navigator.serial.requestPort({ filters })
      transport = new Transport(device, true)
    }

    try {
      const flashOptions = {
        transport,
        baudrate: 115200,
        terminal: espLoaderTerminal,
      } as LoaderOptions
      esploader = new ESPLoader(flashOptions)

      await esploader.main()

      // Temporarily broken
      await esploader.flashId()
    } catch (e: any) {
      toast.error(e.message)
      console.error(e)
      term.writeln(`Error: ${e.message}`)
      cleanUp()
    }

    try {
      await esploader.eraseFlash()
    } catch (e: any) {
      toast.error(e.message)
      console.error(e)
      term.writeln(`Error: ${e.message}`)
    }

    const fileArray = []

    if (fileData && parttition && bootLoader) {
      fileArray.push({ data: bootLoader, address: 0x1000 })
      fileArray.push({ data: parttition, address: 0x8000 })
      fileArray.push({ data: fileData, address: 0x10000 })
    } else {
      console.error('No file data available')
      return
    }

    try {
      const flashOptions: FlashOptions = {
        fileArray: fileArray,
        flashSize: "keep",
        eraseAll: false,
        compress: true,
        reportProgress: (_fileIndex, written, total) => {
          setFlashProgress(((written / total) * 100).toFixed(2))
        },
        calculateMD5Hash: (image): string => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)) as unknown as string,
      } as FlashOptions
      await esploader.writeFlash(flashOptions)
    } catch (e: any) {
      toast.error(e.message)
      console.error(e)
      term.writeln(`Error: ${e.message}`)
    } finally {
      await cleanUp()
    }
  }

  const cleanUp = async () => {
    if (transport) await transport.disconnect()
    setFileData(null)
    device = null as unknown as SerialPort
    transport = null as unknown as Transport
  }

  // ส่วนของการค้นหาและเลื่อนหน้าการ์ด
  useEffect(() => {
    setCurrentPage(0)
    setDisplayedCards(dataFiles ? dataFiles.slice(0, cardsPerPage) : [])
    showPage(0, searchQuery)
  }, [searchQuery, dataFiles, cardsPerPage])

  useEffect(() => {
    showPage(currentPage, searchQuery)
  }, [currentPage, dataFiles, cardsPerPage])

  const showPage = (pageNumber: number, query: string = '') => {
    const startIndex = pageNumber * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    const filteredCards = dataFiles ? (query ? dataFiles.filter(card => [card.fileName, card.createDate].some(attr => attr.toLowerCase().includes(query.toLowerCase()))) : dataFiles) : []
    const cardsToDisplay = filteredCards ? filteredCards.slice(startIndex, endIndex) : []
    setDisplayedCards(cardsToDisplay)
  }

  const changePage = (change: number) => {
    setCurrentPage(currentPage + change)
  }

  const displaySelectDevices = (event: ChangeEvent<HTMLSelectElement>) => {
    setCardsPerPage(Number(event.target.value))
  }
  // จบส่วนการ์ด

  useEffect(() => {
    return () => {
      cleanUp()
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = '' // ตามสเปคของ HTML5
    }

    if (flashProgress !== '0') {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const versionCompare = (a: FirmwareItem, b: FirmwareItem) => {
    const versionA = a.fileName.match(/(\d+)\.(\d+)\.(\d+)/)
    const versionB = b.fileName.match(/(\d+)\.(\d+)\.(\d+)/)

    if (a.fileName.startsWith('i-TeM') && !b.fileName.startsWith('i-TeM')) return 1
    if (b.fileName.startsWith('i-TeM') && !a.fileName.startsWith('i-TeM')) return -1

    if (versionA && versionB) {
      const majorA = parseInt(versionA[1], 10)
      const minorA = parseInt(versionA[2], 10)
      const patchA = parseInt(versionA[3], 10)

      const majorB = parseInt(versionB[1], 10)
      const minorB = parseInt(versionB[2], 10)
      const patchB = parseInt(versionB[3], 10)

      return (
        majorA - majorB ||
        minorA - minorB ||
        patchA - patchB
      )
    }
    return 0
  }

  const combinedList = displayedCards
    .filter((filter) =>
      !filter.fileName.startsWith('bootloader') &&
      !filter.fileName.startsWith('partition')
    )
    .sort(versionCompare)

  return (
    <FirmwareContainer>
      <FirmwareHeader>
        <h3>{t('titleFirmware')}</h3>
        <div>
          <UploadButton onClick={() => navigate('/management/flasher')}>
            <RiCodeSSlashLine size={24} />
            {t('flashButton')}
          </UploadButton>
          <UploadButton onClick={openModal}>
            <RiFileUploadLine size={24} />
            {t('uploadButton')}
          </UploadButton>
        </div>
      </FirmwareHeader>
      <PaginitionContainer className="mt-3">
        <div></div>
        <Paginition
          currentPage={currentPage}
          cardsPerPage={cardsPerPage}
          changePage={changePage}
          displaySelectDevices={displaySelectDevices}
          displayedCards={combinedList}
          userdata={dataFiles}
        />
      </PaginitionContainer>
      <FirewareContent>
        {
          combinedList.map((items: FirmwareItem, index: number) => (
            <FileList key={items.fileName + index}>
              <div>
                <img src={BinIco} alt="Icon" />
                <div>
                  <span>{items.fileName}</span>
                  <small>{items.fileSize}</small>
                  <div>
                    <small>{items.createDate.split(' ')[0]}</small>
                    <small>{items.createDate.split(' ')[1]}</small>
                  </div>
                </div>
              </div>
              <div>
                {
                  !items.fileName.startsWith('bootloader') && !items.fileName.startsWith('partition') &&
                  <div>
                    <button onClick={() => {
                      downloadFw(items.fileName);
                      getBootLoader();
                      getPartition();
                    }}>
                      <RiDownloadCloud2Line size={32} />
                    </button>
                    <button onClick={() => swalWithBootstrapButtons
                      .fire({
                        title: t('deleteFirmware'),
                        html: `${items.fileName}<br />${t('deleteFirmwareText')}`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: t('confirmButton'),
                        cancelButtonText: t('cancelButton'),
                        reverseButtons: false,
                      })
                      .then((result) => {
                        if (result.isConfirmed) {
                          deleteFw(items.fileName);
                        }
                      })}>
                      <RiDeleteBin2Line size={32} />
                    </button>
                  </div>
                }
              </div>
            </FileList>
          ))
        }
      </FirewareContent>

      <Modal size={"xl"} show={showConsole} onHide={closeModalConsole}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('uploadButton')}
            </strong>
            {/* <pre>{JSON.stringify(file, null, 2)}</pre> */}
            <button onClick={closeModalConsole}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <ProgressBar $primary={flashProgress} />
            <TerminalComponent terminalRef={terminalRef} />
          </Modal.Body>
        </Form>
      </Modal>

      <Modal size={"lg"} show={show} onHide={closeModal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('uploadButton')}
            </strong>
            {/* <pre>{JSON.stringify(file, null, 2)}</pre> */}
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <RowChildren>
              <FileUploader
                handleChange={handleChange}
                onTypeError={handleError}
                name={file?.name}
                types={fileTypes}
                label={t('uploadLabel')}
                children={<UploadJSXStyle />}
                dropMessageStyle={{ backgroundColor: 'var(--main-color-opacity2)' }}
                onDraggingStateChange={handleDrag} />
            </RowChildren>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('uploadButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </FirmwareContainer>
  )
}
