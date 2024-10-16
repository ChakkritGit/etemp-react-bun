import { ProbeDeviceType } from "./device.type"

type probeType = {
  probeId: string,
  probeName: string,
  probeType: string,
  probeCh: string,
  tempMin: number,
  tempMax: number,
  humMin: number,
  humMax: number,
  adjustTemp: number,
  adjustHum: number,
  delayTime: string,
  door: number,
  location: string,
  devSerial: string,
  createAt: string,
  updateAt: string,
  device: ProbeDeviceType
}

export type { probeType }