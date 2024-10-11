import { CookieType } from "../types/cookie.type"
import Cookies, { CookieSetOptions } from "universal-cookie"
import CryptoJS from "crypto-js"
import { Option, Schedule, ScheduleHour, ScheduleMinute } from "../types/config.type"
import piexif from 'piexifjs'

export const getDateNow = () => {
  let date = new Date()
  let year = date.getFullYear()
  let month = ("0" + (date.getMonth() + 1)).slice(-2)
  let day = ("0" + date.getDate()).slice(-2)
  return String(year + '-' + month + '-' + day)
}

export const resetActive = {
  probe: false,
  door: false,
  connect: false,
  plug: false,
  sd: false,
  adjust: false,
  repair: false,
  warranty: false
}

export const cookies = new Cookies()

export const accessToken = (localDataObject: CookieType) => CryptoJS.AES.encrypt(JSON.stringify(localDataObject), `${import.meta.env.VITE_APP_SECRETKEY}`)
export const decodeCookieObject = (cookieEncode: string) => CryptoJS.AES.decrypt(cookieEncode, `${import.meta.env.VITE_APP_SECRETKEY}`)

const expiresDate = () => {
  // ตั้งค่า cookies พร้อม expiration date ที่ไกลในอนาคต
  const expirationDate = new Date()
  return expirationDate.setHours(expirationDate.getHours() + 240) // 8 วันนับจากวันนี้
}

export const cookieOptions: CookieSetOptions = {
  path: '/',
  expires: new Date(expiresDate()), // 8 วันนับจากวันนี้
  maxAge: Number(import.meta.env.VITE_APP_MAXAGE * 24 * 60 * 60),
  domain: import.meta.env.VITE_APP_NODE_ENV === 'development' ? 'localhost' : import.meta.env.VITE_APP_DOMAIN, // ถ้าไม่ต้องการใช้ domain ให้คอมเมนต์หรือเอาบรรทัดนี้ออก
  secure: true, // ใช้ secure cookies เฉพาะเมื่อทำงานบน HTTPS
  httpOnly: false, // กำหนดเป็น true ถ้าต้องการให้ cookies สามารถเข้าถึงได้จากเซิร์ฟเวอร์เท่านั้น
  sameSite: true // ตัวเลือก 'strict', 'lax', หรือ 'none'
}

export const resizeImage = (file: File, targetDPI: number = 300): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const image: HTMLImageElement = new Image()
      image.src = e.target?.result as string

      image.onload = () => {
        const canvas = document.createElement('canvas')
        const context: CanvasRenderingContext2D | null = canvas.getContext('2d')

        const maxDimensions = { width: 720, height: 720 }
        const scaleFactor = Math.min(maxDimensions.width / image.width, maxDimensions.height / image.height)

        const originalWidth = image.width * scaleFactor;
        const originalHeight = image.height * scaleFactor;

        const dpiScale = targetDPI / 96
        canvas.width = originalWidth * dpiScale
        canvas.height = originalHeight * dpiScale

        canvas.style.width = `${originalWidth}px`
        canvas.style.height = `${originalHeight}px`

        context?.scale(dpiScale, dpiScale)

        context?.drawImage(image, 0, 0, originalWidth, originalHeight)

        const mimeString = file.type

        if (mimeString === 'image/jpeg') {
          const originalData = e.target?.result as string
          const exifObj = piexif.load(originalData)

          exifObj['0th'] = exifObj['0th'] || {}
          exifObj['0th'][piexif.ImageIFD.Copyright] = 'SMTrack+ Copyright - Thanes Development Co., Ltd.'

          const exifStr = piexif.dump(exifObj)
          const newImageData = piexif.insert(exifStr, canvas.toDataURL(file.type))

          const byteString = atob(newImageData.split(',')[1])
          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }

          const blob = new Blob([ab], { type: mimeString })
          const resizedFile = new File([blob], file.name, { type: file.type })
          resolve(resizedFile)

        } else if (mimeString === 'image/png' || mimeString === 'image/gif') {
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, { type: file.type })
              resolve(resizedFile)
            } else {
              reject(new Error('Failed to convert canvas to Blob for PNG/GIF'))
            }
          }, mimeString)

        } else {
          reject(new Error('Unsupported file format'))
        }
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}

export const scheduleDayArray: Schedule[] = [
  {
    scheduleKey: 'MON',
    scheduleLabel: 'MON'
  },
  {
    scheduleKey: 'TUE',
    scheduleLabel: 'TUE'
  },
  {
    scheduleKey: 'WED',
    scheduleLabel: 'WED'
  },
  {
    scheduleKey: 'THU',
    scheduleLabel: 'THU'
  },
  {
    scheduleKey: 'FRI',
    scheduleLabel: 'FRI'
  },
  {
    scheduleKey: 'SAT',
    scheduleLabel: 'SAT'
  },
  {
    scheduleKey: 'SUN',
    scheduleLabel: 'SUN'
  },
]

export const scheduleTimeArray: ScheduleHour[] = [
  {
    scheduleHourKey: '00',
    scheduleHourLabel: '00'
  },
  {
    scheduleHourKey: '01',
    scheduleHourLabel: '01'
  },
  {
    scheduleHourKey: '02',
    scheduleHourLabel: '02'
  },
  {
    scheduleHourKey: '03',
    scheduleHourLabel: '03'
  },
  {
    scheduleHourKey: '04',
    scheduleHourLabel: '04'
  },
  {
    scheduleHourKey: '05',
    scheduleHourLabel: '05'
  },
  {
    scheduleHourKey: '06',
    scheduleHourLabel: '06'
  },
  {
    scheduleHourKey: '07',
    scheduleHourLabel: '07'
  },
  {
    scheduleHourKey: '08',
    scheduleHourLabel: '08'
  },
  {
    scheduleHourKey: '09',
    scheduleHourLabel: '09'
  },
  {
    scheduleHourKey: '10',
    scheduleHourLabel: '10'
  },
  {
    scheduleHourKey: '11',
    scheduleHourLabel: '11'
  },
  {
    scheduleHourKey: '12',
    scheduleHourLabel: '12'
  },
  {
    scheduleHourKey: '13',
    scheduleHourLabel: '13'
  },
  {
    scheduleHourKey: '14',
    scheduleHourLabel: '14'
  },
  {
    scheduleHourKey: '15',
    scheduleHourLabel: '15'
  },
  {
    scheduleHourKey: '16',
    scheduleHourLabel: '16'
  },
  {
    scheduleHourKey: '17',
    scheduleHourLabel: '17'
  },
  {
    scheduleHourKey: '18',
    scheduleHourLabel: '18'
  },
  {
    scheduleHourKey: '19',
    scheduleHourLabel: '19'
  },
  {
    scheduleHourKey: '20',
    scheduleHourLabel: '20'
  },
  {
    scheduleHourKey: '21',
    scheduleHourLabel: '21'
  },
  {
    scheduleHourKey: '22',
    scheduleHourLabel: '22'
  },
  {
    scheduleHourKey: '23',
    scheduleHourLabel: '23'
  }
]

export const scheduleMinuteArray: ScheduleMinute[] = [
  {
    scheduleMinuteKey: '00',
    scheduleMinuteLabel: '00'
  },
  {
    scheduleMinuteKey: '10',
    scheduleMinuteLabel: '10'
  },
  {
    scheduleMinuteKey: '20',
    scheduleMinuteLabel: '20'
  },
  {
    scheduleMinuteKey: '30',
    scheduleMinuteLabel: '30'
  },
  {
    scheduleMinuteKey: '40',
    scheduleMinuteLabel: '40'
  },
  {
    scheduleMinuteKey: '50',
    scheduleMinuteLabel: '50'
  },
]

export const getFormattedDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

export const formattedDate = getFormattedDate()
export const yearMonth = formattedDate.substring(0, 6)

export const createCard = (id: number, title: string, count: number, times: string, svg: JSX.Element, cardname: string, active: boolean) => ({
  id,
  title,
  count,
  times,
  svg,
  cardname,
  active
})

export const styleElement = document.createElement('style')

styleElement.innerHTML = `
  .apexcharts-tooltip {
    color: black;
  }
  .apexcharts-text tspan {
    fill: black;
  }
  .apexcharts-legend-text {
    color: black !important;
  }
  .apexcharts-menu-icon, .apexcharts-pan-icon, .apexcharts-reset-icon, .apexcharts-selection-icon, .apexcharts-toolbar-custom-icon, .apexcharts-zoom-icon, .apexcharts-zoomin-icon, .apexcharts-zoomout-icon {
    color: black !important;
  }
  .apexcharts-menu-icon svg,
  .apexcharts-pan-icon svg,
  .apexcharts-reset-icon svg,
  .apexcharts-selection-icon svg,
  .apexcharts-toolbar-custom-icon svg,
  .apexcharts-zoom-icon svg,
  .apexcharts-zoomin-icon svg,
  .apexcharts-zoomout-icon svg {
    fill: black !important;
  }
  .apexcharts-menu {
    color: black;
  }
  .apexcharts-gridline {
    stroke: var(--grey-25);
  }
`

export const companyList = [
  {
    key: 0,
    value: 'SCI 1'
  },
  {
    key: 1,
    value: 'SCI 2'
  }
]

export const paginationCardHome = [
  {
    key: 10,
    value: '10'
  },
  {
    key: 20,
    value: '20'
  },
  {
    key: 40,
    value: '40'
  },
  {
    key: 60,
    value: '60'
  },
  {
    key: 80,
    value: '80'
  },
  {
    key: 100,
    value: '100'
  }
]

export const paginationCardUsers = [
  {
    key: 50,
    value: '50'
  },
  {
    key: 80,
    value: '80'
  },
  {
    key: 100,
    value: '100'
  },
  {
    key: 150,
    value: '150'
  }
]

export const countryCodes = [
  { code: '+1', country: 'United States' },
  { code: '+1', country: 'Canada' },
  { code: '+7', country: 'Russia' },
  { code: '+20', country: 'Egypt' },
  { code: '+27', country: 'South Africa' },
  { code: '+30', country: 'Greece' },
  { code: '+31', country: 'Netherlands' },
  { code: '+32', country: 'Belgium' },
  { code: '+33', country: 'France' },
  { code: '+34', country: 'Spain' },
  { code: '+36', country: 'Hungary' },
  { code: '+39', country: 'Italy' },
  { code: '+40', country: 'Romania' },
  { code: '+41', country: 'Switzerland' },
  { code: '+43', country: 'Austria' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+45', country: 'Denmark' },
  { code: '+46', country: 'Sweden' },
  { code: '+47', country: 'Norway' },
  { code: '+48', country: 'Poland' },
  { code: '+49', country: 'Germany' },
  { code: '+51', country: 'Peru' },
  { code: '+52', country: 'Mexico' },
  { code: '+54', country: 'Argentina' },
  { code: '+55', country: 'Brazil' },
  { code: '+56', country: 'Chile' },
  { code: '+57', country: 'Colombia' },
  { code: '+58', country: 'Venezuela' },
  { code: '+60', country: 'Malaysia' },
  { code: '+61', country: 'Australia' },
  { code: '+62', country: 'Indonesia' },
  { code: '+63', country: 'Philippines' },
  { code: '+64', country: 'New Zealand' },
  { code: '+65', country: 'Singapore' },
  { code: '+66', country: 'Thailand' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+84', country: 'Vietnam' },
  { code: '+86', country: 'China' },
  { code: '+90', country: 'Turkey' },
  { code: '+91', country: 'India' },
  { code: '+92', country: 'Pakistan' },
  { code: '+93', country: 'Afghanistan' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+95', country: 'Myanmar' },
  { code: '+98', country: 'Iran' },
  { code: '+212', country: 'Morocco' },
  { code: '+213', country: 'Algeria' },
  { code: '+216', country: 'Tunisia' },
  { code: '+218', country: 'Libya' },
  { code: '+220', country: 'Gambia' },
  { code: '+221', country: 'Senegal' },
  { code: '+222', country: 'Mauritania' },
  { code: '+223', country: 'Mali' },
  { code: '+224', country: 'Guinea' },
  { code: '+225', country: 'Ivory Coast' },
  { code: '+226', country: 'Burkina Faso' },
  { code: '+227', country: 'Niger' },
  { code: '+228', country: 'Togo' },
  { code: '+229', country: 'Benin' },
  { code: '+230', country: 'Mauritius' },
  { code: '+231', country: 'Liberia' },
  { code: '+232', country: 'Sierra Leone' },
  { code: '+233', country: 'Ghana' },
  { code: '+234', country: 'Nigeria' },
  { code: '+235', country: 'Chad' },
  { code: '+236', country: 'Central African Republic' },
  { code: '+237', country: 'Cameroon' },
  { code: '+238', country: 'Cape Verde' },
  { code: '+239', country: 'São Tomé and Príncipe' },
  { code: '+240', country: 'Equatorial Guinea' },
  { code: '+241', country: 'Gabon' },
  { code: '+242', country: 'Republic of the Congo' },
  { code: '+243', country: 'Democratic Republic of the Congo' },
  { code: '+244', country: 'Angola' },
  { code: '+245', country: 'Guinea-Bissau' },
  { code: '+246', country: 'British Indian Ocean Territory' },
  { code: '+248', country: 'Seychelles' },
  { code: '+249', country: 'Sudan' },
  { code: '+250', country: 'Rwanda' },
  { code: '+251', country: 'Ethiopia' },
  { code: '+252', country: 'Somalia' },
  { code: '+253', country: 'Djibouti' },
  { code: '+254', country: 'Kenya' },
  { code: '+255', country: 'Tanzania' },
  { code: '+256', country: 'Uganda' },
  { code: '+257', country: 'Burundi' },
  { code: '+258', country: 'Mozambique' },
  { code: '+260', country: 'Zambia' },
  { code: '+261', country: 'Madagascar' },
  { code: '+262', country: 'Réunion' },
  { code: '+263', country: 'Zimbabwe' },
  { code: '+264', country: 'Namibia' },
  { code: '+265', country: 'Malawi' },
  { code: '+266', country: 'Lesotho' },
  { code: '+267', country: 'Botswana' },
  { code: '+268', country: 'Eswatini' },
  { code: '+269', country: 'Comoros' },
  { code: '+290', country: 'Saint Helena' },
  { code: '+291', country: 'Eritrea' },
  { code: '+297', country: 'Aruba' },
  { code: '+298', country: 'Faroe Islands' },
  { code: '+299', country: 'Greenland' },
  { code: '+350', country: 'Gibraltar' },
  { code: '+351', country: 'Portugal' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+353', country: 'Ireland' },
  { code: '+354', country: 'Iceland' },
  { code: '+355', country: 'Albania' },
  { code: '+356', country: 'Malta' },
  { code: '+357', country: 'Cyprus' },
  { code: '+358', country: 'Finland' },
  { code: '+359', country: 'Bulgaria' },
  { code: '+370', country: 'Lithuania' },
  { code: '+371', country: 'Latvia' },
  { code: '+372', country: 'Estonia' },
  { code: '+373', country: 'Moldova' },
  { code: '+374', country: 'Armenia' },
  { code: '+375', country: 'Belarus' },
  { code: '+376', country: 'Andorra' },
  { code: '+377', country: 'Monaco' },
  { code: '+378', country: 'San Marino' },
  { code: '+379', country: 'Vatican City' },
  { code: '+380', country: 'Ukraine' },
  { code: '+381', country: 'Serbia' },
  { code: '+382', country: 'Montenegro' },
  { code: '+383', country: 'Kosovo' },
  { code: '+385', country: 'Croatia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+387', country: 'Bosnia and Herzegovina' },
  { code: '+389', country: 'North Macedonia' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+421', country: 'Slovakia' },
  { code: '+423', country: 'Liechtenstein' },
  { code: '+500', country: 'Falkland Islands' },
  { code: '+501', country: 'Belize' },
  { code: '+502', country: 'Guatemala' },
  { code: '+503', country: 'El Salvador' },
  { code: '+504', country: 'Honduras' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+507', country: 'Panama' },
  { code: '+508', country: 'Saint Pierre and Miquelon' },
  { code: '+509', country: 'Haiti' },
  { code: '+590', country: 'Guadeloupe' },
  { code: '+591', country: 'Bolivia' },
  { code: '+592', country: 'Guyana' },
  { code: '+593', country: 'Ecuador' },
  { code: '+595', country: 'Paraguay' },
  { code: '+597', country: 'Suriname' },
  { code: '+598', country: 'Uruguay' },
  { code: '+599', country: 'Netherlands Antilles' },
  { code: '+670', country: 'East Timor' },
  { code: '+672', country: 'Norfolk Island' },
  { code: '+673', country: 'Brunei' },
  { code: '+674', country: 'Nauru' },
  { code: '+675', country: 'Papua New Guinea' },
  { code: '+676', country: 'Tonga' },
  { code: '+677', country: 'Solomon Islands' },
  { code: '+678', country: 'Vanuatu' },
  { code: '+679', country: 'Fiji' },
  { code: '+680', country: 'Palau' },
  { code: '+681', country: 'Wallis and Futuna' },
  { code: '+682', country: 'Cook Islands' },
  { code: '+683', country: 'Niue' },
  { code: '+685', country: 'Samoa' },
  { code: '+686', country: 'Kiribati' },
  { code: '+687', country: 'New Caledonia' },
  { code: '+688', country: 'Tuvalu' },
  { code: '+689', country: 'French Polynesia' },
  { code: '+690', country: 'Tokelau' },
  { code: '+691', country: 'Micronesia' },
  { code: '+692', country: 'Marshall Islands' },
  { code: '+850', country: 'North Korea' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+853', country: 'Macau' },
  { code: '+855', country: 'Cambodia' },
  { code: '+856', country: 'Laos' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+886', country: 'Taiwan' },
  { code: '+960', country: 'Maldives' },
  { code: '+961', country: 'Lebanon' },
  { code: '+962', country: 'Jordan' },
  { code: '+963', country: 'Syria' },
  { code: '+964', country: 'Iraq' },
  { code: '+965', country: 'Kuwait' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+967', country: 'Yemen' },
  { code: '+968', country: 'Oman' },
  { code: '+970', country: 'Palestine' },
  { code: '+971', country: 'United Arab Emirates' },
  { code: '+972', country: 'Israel' },
  { code: '+973', country: 'Bahrain' },
  { code: '+974', country: 'Qatar' },
  { code: '+975', country: 'Bhutan' },
  { code: '+976', country: 'Mongolia' },
  { code: '+977', country: 'Nepal' },
  { code: '+992', country: 'Tajikistan' },
  { code: '+993', country: 'Turkmenistan' },
  { code: '+994', country: 'Azerbaijan' },
  { code: '+995', country: 'Georgia' },
  { code: '+996', country: 'Kyrgyzstan' },
  { code: '+998', country: 'Uzbekistan' },
]

export const hoursOptions = Array.from({ length: 24 }, (_, i) => ({
  value: String(i).padStart(2, '0'),
  label: String(i).padStart(2, '0'),
}))

export const minutesOptions = Array.from({ length: 60 }, (_, i) => ({
  value: String(i).padStart(2, '0'),
  label: String(i).padStart(2, '0'),
}))

export const generateOptions = () => {
  let option = []
  for (let i = 5; i <= 120; i += 5) {
    option.push({
      value: String(i),
      label: String(i)
    })
  }
  return option
}


export const mapOptions = <T, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
  data.map(item => ({
    value: item[valueKey] as unknown as string,
    label: item[labelKey] as unknown as string
  }))

export const mapDefaultValue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
  data.filter(item => item[valueKey] === id).map(item => ({
    value: item[valueKey] as unknown as string,
    label: item[labelKey] as unknown as string
  }))[0]