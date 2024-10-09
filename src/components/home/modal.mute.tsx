import { Modal } from "react-bootstrap"
import { FormBtn, FormFlexBtn, ModalHead } from "../../style/style"
import { ModalMuteHead, NotiActionFlex } from "../../style/components/home.styled"
import { useTranslation } from "react-i18next"
import { RiArrowLeftSLine } from "react-icons/ri"
import { devicesType } from "../../types/device.type"
import { Dispatch, SetStateAction, useState } from "react"
import { MuteEtemp } from "../../style/components/sound.setting"
import { cookieOptions, cookies } from "../../constants/constants"
import { client } from "../../services/mqtt"

type modalAdjustType = {
  devicesdata: devicesType,
  setShowSettingMute: Dispatch<SetStateAction<boolean>>,
  setShow: Dispatch<SetStateAction<boolean>>,
  showSettingMute: boolean,
}

function ModalMute(modalProps: modalAdjustType) {
  const { devicesdata, setShow, setShowSettingMute, showSettingMute } = modalProps
  const { t } = useTranslation()

  const [muteEtemp, setMuteEtemp] = useState({
    temporary: false,
    always: cookies.get(devicesdata.devSerial) === 'always' || false,
    door: cookies.get(devicesdata.devSerial) === 'door' || false,
  })

  const closeSettingMute = () => {
    setShowSettingMute(false)
    setShow(true)
  }

  const switchMute = (mode: string) => {
    const deviceModel = devicesdata.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
    if (mode === 'temporary') {
      setMuteEtemp({ ...muteEtemp, temporary: !muteEtemp.temporary })
      if (muteEtemp.temporary) {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/short`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/short`, 'on')
        }
        client.publish(`${devicesdata.devSerial}/mute/short`, 'on')
      } else {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/short`, 'off')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/short`, 'off')
        }
        client.publish(`${devicesdata.devSerial}/mute/short`, 'off')
      }
    } else if (mode === 'always') {
      setMuteEtemp({ ...muteEtemp, always: !muteEtemp.always })
      if (muteEtemp.always) {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/long`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/long`, 'on')
        }
        client.publish(`${devicesdata.devSerial}/mute/long`, 'on')
        cookies.remove(devicesdata.devSerial)
      } else {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/short`, 'off')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/short`, 'off')
        }
        client.publish(`${devicesdata.devSerial}/mute/long`, 'off')
        cookies.set(devicesdata.devSerial, 'always', cookieOptions)
      }
    } else {
      setMuteEtemp({ ...muteEtemp, door: !muteEtemp.door })
      if (muteEtemp.door) {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/door`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/door`, 'on')
        }
        client.publish(`${devicesdata.devSerial}/mute/door`, 'on')
        cookies.remove(devicesdata.devSerial)
      } else {
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${devicesdata.devSerial}/mute/short`, 'off')
        } else {
          client.publish(`siamatic/items/v3/${devicesdata.devSerial}/mute/short`, 'off')
        }
        client.publish(`${devicesdata.devSerial}/mute/door`, 'off')
        cookies.set(devicesdata.devSerial, 'door', cookieOptions)
      }
    }
  }

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
        <NotiActionFlex>
          <div>
            <span>{t('muteTemporary')}</span>
            <MuteEtemp type="button" onClick={() => switchMute('temporary')} $primary={!muteEtemp.temporary}>
              <div className="icon">
                {!muteEtemp.temporary ? t('stateOn') : t('stateOff')}
              </div>
            </MuteEtemp>
          </div>
          <div>
            <span>{t('muteAlways')}</span>
            <MuteEtemp type="button" onClick={() => switchMute('always')} $primary={!muteEtemp.always}>
              <div className="icon">
                {!muteEtemp.always ? t('stateOn') : t('stateOff')}
              </div>
            </MuteEtemp>
          </div>
          <div>
            <span>{t('muteDoor')}</span>
            <MuteEtemp type="button" onClick={() => switchMute('door')} $primary={!muteEtemp.door}>
              <div className="icon">
                {!muteEtemp.door ? t('stateOn') : t('stateOff')}
              </div>
            </MuteEtemp>
          </div>
        </NotiActionFlex>
      </Modal.Body>
      <Modal.Footer>
        <FormFlexBtn>
          <FormBtn type="submit">
            {t('notificationButtonSubmit')}
          </FormBtn>
        </FormFlexBtn>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalMute