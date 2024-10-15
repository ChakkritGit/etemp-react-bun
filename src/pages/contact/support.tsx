import { useTranslation } from "react-i18next"
import { AgreeSection, CardListFlex, ContactContainer, InputSupport, LabelContact, ListGrid, PhoneGroup, SubmitButton, TextAreContact } from "../../style/components/contact.styled"
import { LoginContact } from "../../style/components/login"
import { LineHr } from "../../style/style"
import { Col, Form, Row } from "react-bootstrap"
import { FormEvent } from "react"
import { Link } from "react-router-dom"
import { countryCodes } from "../../constants/constants"
import { RiFacebookCircleFill, RiMailFill, RiPhoneFill } from "react-icons/ri"
import { FaLine } from "react-icons/fa"

function Support() {
  const { t } = useTranslation()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <ContactContainer>
      <h1>{t('contactSupport')}</h1>
      <ListGrid>
        <div>
          <h3>{t('getInTouch')}</h3>
          <span>{t('contactDes')}</span>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={6}>
                <LabelContact htmlFor="first-name">
                  <InputSupport type="text" id="first-name" name="first-name" placeholder={t('contactFirstName')} />
                </LabelContact>
              </Col>
              <Col lg={6}>
                <LabelContact htmlFor="last-name">
                  <InputSupport type="text" id="last-name" name="last-name" placeholder={t('contactLastName')} />
                </LabelContact>
              </Col>
              <Col lg={12}>
                <LabelContact htmlFor="email">
                  <InputSupport type="email" id="email" name="email" placeholder={t('contactEmail')} />
                </LabelContact>
              </Col>
              <Col lg={12}>
                <LabelContact htmlFor="tel">
                  <PhoneGroup>
                    <select name="countryCode" id="countryCode" defaultValue={'+66'}>
                      <option value="">Select Country Code</option>
                      {countryCodes.map((item, index) => (
                        <option key={index} value={item.code}>
                          {item.country} ({item.code})
                        </option>
                      ))}
                    </select>
                    <InputSupport type="tel" id="email" name="tel" placeholder={t('contactPhone')} />
                  </PhoneGroup>
                </LabelContact>
              </Col>
              <Col lg={12}>
                <LabelContact htmlFor="howcanwehelp">
                  <TextAreContact
                    id="howcanwehelp"
                    name="howcanwehelp"
                    placeholder={t('contactDetail')}
                    rows={4}
                  />
                </LabelContact>
              </Col>
              <Col lg={12}>
                <SubmitButton type="submit">{t('contactSubmit')}</SubmitButton>
              </Col>
              <AgreeSection>
                <span>
                  {t('contactAgree')} <Link to={'/privacy-policy'}>{t('contactAgreeLink')}</Link>
                </span>
              </AgreeSection>
            </Row>
          </Form>
        </div>
      </ListGrid>
      <LoginContact $primary>
        <LineHr />
        <span className=''>{t('contactUs')}</span>
        <LineHr />
      </LoginContact>
      <CardListFlex>
        <a href="tel:027914500" target="_blank" rel="noopener noreferrer">
          <RiPhoneFill />
          {/* <span>Phone</span> */}
        </a>
        <a href="mailto:thanes@thanesgroup.com" target="_blank" rel="noopener noreferrer">
          <RiMailFill />
          {/* <span>Mail</span> */}
        </a>
        <a href="https://line.me/R/ti/p/%40925maysc" target="_blank" rel="noopener noreferrer">
          <FaLine />
          {/* <span>Line</span> */}
        </a>
        <a href="https://www.facebook.com/thanesgroup" target="_blank" rel="noopener noreferrer">
          <RiFacebookCircleFill />
          {/* <span>Facebook</span> */}
        </a>
      </CardListFlex>

    </ContactContainer>
  )
}

export default Support