import { Modal } from "react-bootstrap"
import { ModalHead } from "../../style/style"
import { ModalMuteHead, NotiActionFlex } from "../../style/components/home.styled"
import { useTranslation } from "react-i18next"
import { RiArrowLeftSLine, RiVolumeUpLine, RiVolumeVibrateLine } from "react-icons/ri"
import { devicesType } from "../../types/device.type"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { MuteEtemp } from "../../style/components/sound.setting"
import { cookies, generateOptions, mapDefaultValue, mapOptions } from "../../constants/constants"
import { client } from "../../services/mqtt"
import Select from 'react-select'
import { useTheme } from "../../theme/ThemeProvider"

type selectOption = {
  value: string,
  label: string
}

type MqttType = {
  always: string,
  alert: string
}


type modalAdjustType = {
  devicesdata: devicesType,
  setShowSettingMute: Dispatch<SetStateAction<boolean>>,
  setShow: Dispatch<SetStateAction<boolean>>,
  showSettingMute: boolean,
}

function ModalMute(modalProps: modalAdjustType) {
  const { devicesdata, setShow, setShowSettingMute, showSettingMute } = modalProps
  const { devSerial, config } = devicesdata
  const { t } = useTranslation()
  const { theme } = useTheme()
  const deviceModel = devSerial.substring(0, 3) === "eTP" ? "etemp" : "items"
  const version = devSerial.substring(3, 5).toLowerCase()
  const [muteDoor, setMuteDoor] = useState<MqttType>({
    always: '',
    alert: ''
  })

  const { alert, always } = muteDoor

  const [muteEtemp, setMuteEtemp] = useState({
    temporary: false,
    always: cookies.get(devSerial) === 'always' || false,
    door: config.muteDoor === '0' ? false : true,
  })

  const closeSettingMute = () => {
    setShowSettingMute(false)
    setShow(true)
  }

  const muteTemporary = () => {
    setMuteEtemp({ ...muteEtemp, temporary: !muteEtemp.temporary })
    if (muteEtemp.temporary) {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/temporary`, 'on')
      client.publish(`${devSerial}/mute/short`, 'on')
    } else {
      console.log('off')
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/temporary`, 'off')
      client.publish(`${devSerial}/mute/short`, 'off')
    }
  }

  const muteAlarm = () => {
    setMuteEtemp({ ...muteEtemp, door: !muteEtemp.door })
    if (muteEtemp.door) {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/door/alarm`, 'on')
      client.publish(`${devSerial}/mute/long`, 'on')
    } else {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/door/alarm`, 'off')
      client.publish(`${devSerial}/mute/long`, 'off')
    }
  }

  const muteAlways = (status: boolean) => {
    if (status) {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/always`, always)
    } else {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/always`, '0')
    }
  }

  const muteAlert = (status: boolean) => {
    if (status) {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/door/alert`, alert)
    } else {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/door/alert`, '0')
    }
  }

  useEffect(() => {
    if (showSettingMute) {
      client.subscribe(`${devSerial}/mute/status/receive`, (err) => {
        if (err) {
          console.error("MQTT Suubscribe Error", err)
        }
      })

      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/status`, 'on')

      client.on('message', (_topic, message) => {
        setMuteDoor(JSON.parse(message.toString()))
      })

      client.on("error", (err) => {
        console.error("MQTT Error: ", err)
        client.end()
      })

      client.on("reconnect", () => {
        console.error("MQTT Reconnecting...")
      })
    }
  }, [showSettingMute])

  return (
    <Modal size="lg" show={showSettingMute} onHide={closeSettingMute}>
      <Modal.Header>
        <ModalHead>
          <ModalMuteHead onClick={closeSettingMute}>
            <button>
              <RiArrowLeftSLine />
            </button>
            <span>
              {t('muteSettings')}
            </span>
          </ModalMuteHead>
        </ModalHead>
      </Modal.Header>
      <Modal.Body>
        <NotiActionFlex $primary={alert === '' && always === ''}>
          {
            alert !== '' && always !== '' ?
              <>
                {deviceModel === 'etemp' && <div>
                  <span>{t('muteTemporary')}</span>
                  <button onClick={muteTemporary}>
                    {muteEtemp.temporary ? <RiVolumeVibrateLine size={24} /> : <RiVolumeUpLine size={24} />}
                  </button>
                </div>}
                <div>
                  <div>
                    <span>{t('muteAlways')}</span>
                    <span>{always}</span>
                  </div>
                  <div>
                    <Select
                      id="hours"
                      options={mapOptions<selectOption, keyof selectOption>(generateOptions(), 'value', 'label')}
                      value={mapDefaultValue<selectOption, keyof selectOption>(generateOptions(), always, 'value', 'label')}
                      onChange={(e) => setMuteDoor({ ...muteDoor, always: String(e?.value) })}
                      autoFocus={false}
                      placeholder={'เลือกเวลา'}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "`var(--border-dark-color)" : "var(--grey)",
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
                    <button onClick={() => muteAlways(true)}>{t('messageSend')}</button>
                    <button onClick={() => muteAlways(false)}>{t('cancelButton')}</button>
                  </div>
                </div>
                <div>
                  <span>{t('muteDoor')}</span>
                  <MuteEtemp type="button" onClick={muteAlarm} $primary={!muteEtemp.door}>
                    <div className="icon">
                      {!muteEtemp.door ? t('stateOn') : t('stateOff')}
                    </div>
                  </MuteEtemp>
                </div>
                <div>
                  <div>
                    <span>{t('muteAlert')}</span>
                    <span>{alert}</span>
                  </div>
                  <div>
                    <Select
                      id="hours"
                      options={mapOptions<selectOption, keyof selectOption>(generateOptions(), 'value', 'label')}
                      value={mapDefaultValue<selectOption, keyof selectOption>(generateOptions(), alert, 'value', 'label')}
                      onChange={(e) => setMuteDoor({ ...muteDoor, alert: String(e?.value) })}
                      autoFocus={false}
                      placeholder={'เลือกเวลา'}
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
                    <button onClick={() => muteAlert(true)}>{t('messageSend')}</button>
                    <button onClick={() => muteAlert(false)}>{t('cancelButton')}</button>
                  </div>
                </div>
              </>
              :
              <div>{t('loading')}</div>
          }
        </NotiActionFlex>

      </Modal.Body>
      {/* <Modal.Footer>
        <FormFlexBtn>
          <FormBtn type="submit">
            {t('notificationButtonSubmit')}
          </FormBtn>
        </FormFlexBtn>
      </Modal.Footer> */}
    </Modal>
  )
}

export default ModalMute