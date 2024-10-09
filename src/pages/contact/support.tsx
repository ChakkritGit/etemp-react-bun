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
      <h1>Contact Support</h1>
      <ListGrid>
        <div>
          <h3>Get in touch</h3>
          <span>You can reach us anytime</span>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={6}>
                <LabelContact htmlFor="first-name">
                  <InputSupport type="text" id="first-name" name="first-name" placeholder="First Name" />
                </LabelContact>
              </Col>
              <Col lg={6}>
                <LabelContact htmlFor="last-name">
                  <InputSupport type="text" id="last-name" name="last-name" placeholder="Last Name" />
                </LabelContact>
              </Col>
              <Col lg={12}>
                <LabelContact htmlFor="email">
                  <InputSupport type="email" id="email" name="email" placeholder="Email" />
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
                    <InputSupport type="tel" id="email" name="tel" placeholder="Phone Number" />
                  </PhoneGroup>
                </LabelContact>
              </Col>
              <Col lg={12}>
                <LabelContact htmlFor="howcanwehelp">
                  <TextAreContact
                    id="howcanwehelp"
                    name="howcanwehelp"
                    placeholder="How can we help?"
                    rows={4}
                  />
                </LabelContact>
              </Col>
              <Col lg={12}>
                <SubmitButton type="submit">Submit</SubmitButton>
              </Col>
              <AgreeSection>
                <span>
                  By contacting us, your agree to our <Link to={'/privacy-policy'}>Privacy Policy</Link>
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
        <a href="tel:027914500">
          <RiPhoneFill />
          <span>Phone</span>
        </a>
        <a href="mailto:thanes@thanesgroup.com">
          <RiMailFill />
          <span>Mail</span>
        </a>
        <a href="https://line.me/R/ti/p/%40925maysc">
          <FaLine />
          <span>Line</span>
        </a>
        <a href="https://www.facebook.com/thanesgroup">
          <RiFacebookCircleFill />
          <span>Facebook</span>
        </a>
      </CardListFlex>
    </ContactContainer>
  )
}

export default Support