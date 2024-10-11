type configType = {
    confId: string,
    ip: string,
    macAddEth: string,
    macAddWiFi: string,
    subNet: string,
    getway: string,
    dns: string,
    ssid: string,
    ssidPass: string,
    sim: string,
    email1: string,
    email2: string,
    email3: string,
    notiTime: number,
    backToNormal: string,
    mobileNoti: string,
    repeat: number,
    firstDay?: String,
    secondDay?: String,
    thirdDay?: String,
    firstTime?: String,
    secondTime?: String,
    thirdTime?: String,
    devSerial: string,
    createAt: string,
    updateAt: string,
    mode: string,
    modeEth: string,
    ipEth?: string,
    subNetEth?: string,
    getwayEth?: string,
    dnsEth?: string,
    muteDoor: string,
    muteLong: string,
    hardReset?: string
}

type Option = {
    value: string,
    label: string,
}

type Ward = {
    probeId: string,
    probeName: string,
}

type Schedule = {
    scheduleKey: string,
    scheduleLabel: string,
}

type ScheduleHour = {
    scheduleHourKey: string,
    scheduleHourLabel: string,
}

type ScheduleMinute = {
    scheduleMinuteKey: string,
    scheduleMinuteLabel: string,
}

export type { configType, Option, Ward, Schedule, ScheduleHour, ScheduleMinute }