import { Col, Form, InputGroup } from "react-bootstrap"
import { FormSliderRange, LineHr, RangeInputText, SliderFlex, SliderLabelFlex, SliderRangeFlex } from "../../style/style"
import { useTranslation } from "react-i18next"
import { Slider } from "@mui/material"
import { AdjustRealTimeFlex } from "../../style/components/home.styled"
import { RiArrowDownLine, RiArrowRightLine } from "react-icons/ri"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { useSelector } from "react-redux"
import { Dispatch, SetStateAction } from "react"
import { devicesType } from "../../types/device.type"

type AdjustmentType = {
  tempvalue: number[],
  humvalue: number[],
  setTempvalue: Dispatch<SetStateAction<number[]>>,
  setHumvalue: Dispatch<SetStateAction<number[]>>,
  handleTempChange: (_event: Event, newValue: number | number[]) => void,
  handleHumChange: (_event: Event, newValue: number | number[]) => void,
  handleAdjusttempChange: (_event: Event, newValue: number | number[]) => void,
  handleAdjusthumChange: (_event: Event, newValue: number | number[]) => void,
  formData: {
    adjustTemp: number,
    adjustHum: number,
  },
  setFormData: Dispatch<SetStateAction<{
    adjustTemp: number;
    adjustHum: number;
  }>>,
  mqttData: {
    temp: number,
    humi: number,
  },
  devicesdata: devicesType
}

function Adjustment(adjustProps: AdjustmentType) {
  const { t } = useTranslation()
  const { tokenDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { userLevel } = tokenDecode
  const { humvalue, tempvalue, setTempvalue, setHumvalue, handleTempChange,
    handleHumChange, formData, setFormData, handleAdjusttempChange,
    handleAdjusthumChange, mqttData, devicesdata } = adjustProps
  return (
    <>
      <Form.Label className="w-100 form-label">
        <span><b>{t('adjustMents')}</b></span>
        <LineHr />
      </Form.Label>
      <Col lg={6}>
        <InputGroup className="mb-3">
          <Form.Label className="w-100">
            <SliderFlex>
              <SliderLabelFlex>
                <span>{t('tempMin')}</span>
                <div>
                  <RangeInputText type="number"
                    min={-40}
                    max={tempvalue[1]}
                    step={.1}
                    value={tempvalue[0]}
                    onChange={(e) => setTempvalue([Number(e.target.value), tempvalue[1]])} />
                  <strong>°C</strong>
                </div>
              </SliderLabelFlex>
              <SliderLabelFlex>
                <span>{t('tempMax')}</span>
                <div>
                  <RangeInputText type="number"
                    min={tempvalue[0]}
                    max={120}
                    step={.1}
                    value={tempvalue[1]}
                    onChange={(e) => setTempvalue([tempvalue[0], Number(e.target.value)])} />
                  <strong>°C</strong>
                </div>
              </SliderLabelFlex>
            </SliderFlex>
            <SliderRangeFlex $rangename={'temp'}>
              <Slider
                value={tempvalue}
                onChange={handleTempChange}
                valueLabelDisplay="off"
                disableSwap
                min={-40}
                max={120}
                step={.1}
              />
            </SliderRangeFlex>
          </Form.Label>
        </InputGroup>
      </Col>
      <Col lg={6}>
        <InputGroup className="mb-3">
          <Form.Label className="w-100">
            <SliderFlex>
              <SliderLabelFlex>
                <span>{t('humiMin')}</span>
                <div>
                  <RangeInputText type="number"
                    min={0}
                    max={humvalue[1]}
                    step={.1}
                    value={humvalue[0]}
                    onChange={(e) => setHumvalue([Number(e.target.value), humvalue[1]])} />
                  <strong>%</strong>
                </div>
              </SliderLabelFlex>
              <SliderLabelFlex>
                <span>{t('humiMax')}</span>
                <div>
                  <RangeInputText type="number"
                    min={humvalue[0]}
                    max={100}
                    step={.1}
                    value={humvalue[1]}
                    onChange={(e) => setHumvalue([humvalue[0], Number(e.target.value)])} />
                  <strong>%</strong>
                </div>
              </SliderLabelFlex>
            </SliderFlex>
            <SliderRangeFlex $rangename={'hum'}>
              <Slider
                value={humvalue}
                onChange={handleHumChange}
                valueLabelDisplay="off"
                disableSwap
                min={0}
                max={100}
                step={.1}
              />
            </SliderRangeFlex>
          </Form.Label>
        </InputGroup>
      </Col>
      <Col lg={6}>
        <InputGroup className="mb-3">
          <Form.Label className="w-100">
            <SliderLabelFlex>
              <span>{t('adjustTemp')}</span>
              <div>
                <RangeInputText
                  type="number"
                  min={-20}
                  max={20}
                  step={.01}
                  disabled={userLevel === '3' || userLevel === '2'}
                  value={formData.adjustTemp}
                  onChange={(e) => setFormData({ ...formData, adjustTemp: Number(e.target.value) })} />
                <strong>°C</strong>
              </div>
            </SliderLabelFlex>
            <FormSliderRange
              $primary="temp"
              $disabled={userLevel === '3' || userLevel === '2'}
            >
              <Slider
                color="error"
                min={-20}
                max={20}
                step={.01}
                disabled={userLevel === '3' || userLevel === '2'}
                value={formData.adjustTemp}
                onChange={handleAdjusttempChange}
                valueLabelDisplay="off" />
            </FormSliderRange>
          </Form.Label>
        </InputGroup>
      </Col>
      <Col lg={6}>
        <InputGroup className="mb-3">
          <Form.Label className="w-100">
            <SliderLabelFlex>
              <span>{t('adjustHumi')}</span>
              <div>
                <RangeInputText
                  type="number"
                  min={0}
                  max={100}
                  step={.01}
                  disabled={userLevel === '3' || userLevel === '2'}
                  value={formData.adjustHum}
                  onChange={(e) => setFormData({ ...formData, adjustHum: Number(e.target.value) })} />
                <strong>%</strong>
              </div>
            </SliderLabelFlex>
            <FormSliderRange
              $primary="hum"
              $disabled={userLevel === '3' || userLevel === '2'}
            >
              <Slider
                color="primary"
                min={0}
                max={100}
                step={.01}
                disabled={userLevel === '3' || userLevel === '2'}
                value={formData.adjustHum}
                onChange={handleAdjusthumChange}
                valueLabelDisplay="off" />
            </FormSliderRange>
          </Form.Label>
        </InputGroup>
      </Col>
      <Col lg={12}>
        <AdjustRealTimeFlex $primary={Number((mqttData.temp + formData.adjustTemp).toFixed(2)) >= tempvalue[1] || Number((mqttData.temp + formData.adjustTemp).toFixed(2)) <= tempvalue[0]}>
          <div>
            <span>{t('currentTemp')}</span>
            <div>
              <span>
                <span>{mqttData.temp ? mqttData.temp.toFixed(2) : '- -'}</span> °C
              </span>
            </div>
          </div>
          <RiArrowRightLine size={32} fill="grey" />
          <RiArrowDownLine size={32} fill="grey" />
          <div>
            <span>{t('adjustAfterTemp')}</span>
            <div>
              <span>
                <span>{(mqttData.temp + formData.adjustTemp - devicesdata.probe[0]?.adjustTemp) ? (mqttData.temp + formData.adjustTemp - devicesdata.probe[0]?.adjustTemp).toFixed(2) : '- -'}</span> °C
              </span>
            </div>
          </div>
        </AdjustRealTimeFlex>
      </Col>
      <Col lg={12}>
        <AdjustRealTimeFlex $primary={Number((mqttData.humi + formData.adjustHum).toFixed(2)) >= humvalue[1] || Number((mqttData.humi + formData.adjustHum).toFixed(2)) <= humvalue[0]}>
          <div>
            <span>{t('currentHum')}</span>
            <div>
              <span>
                <span>{mqttData.humi ? mqttData.humi.toFixed(2) : '- -'}</span> %
              </span>
            </div>
          </div>
          <RiArrowRightLine size={32} fill="grey" />
          <RiArrowDownLine size={32} fill="grey" />
          <div>
            <span>{t('adjustAfterHum')}</span>
            <div>
              <span>
                <span>{(mqttData.humi + formData.adjustHum - devicesdata.probe[0]?.adjustHum) ? (mqttData.humi + formData.adjustHum - devicesdata.probe[0]?.adjustHum).toFixed(2) : '- -'}</span> %
              </span>
            </div>
          </div>
        </AdjustRealTimeFlex>
      </Col>
    </>
  )
}

export default Adjustment