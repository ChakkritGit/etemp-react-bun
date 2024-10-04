import { useTranslation } from "react-i18next"
import { BackPre, BR, HeadTitle, NavigateTop, PrivacyContainer } from "../../style/components/policy"
import { RiArrowLeftSLine } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"

function Policy() {
  const { t } = useTranslation()
  const navagate = useNavigate()
  const { cookieEncode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)

  return (
    <PrivacyContainer>
      <NavigateTop>
        {cookieEncode ? <BackPre onClick={() => navagate('/settings')}>
          <RiArrowLeftSLine size={24} />
          <span>{t('backToPre')}</span>
        </BackPre> : <div></div>}
        <h4>Privacy & Policy</h4>
        <div></div>
      </NavigateTop>
      <HeadTitle>Privacy Policy</HeadTitle>
      <span>This privacy policy applies to the SMTrack+ app (hereby referred to as "Application") for mobile devices that was created by THANES DEVELOPMENT COMPANY LIMITED (hereby referred to as "Service Provider") as a Free service. This service is intended for use "AS IS".
      </span>
      <BR />
      <HeadTitle>Information Collection and Use</HeadTitle>
      <span>he Application collects information when you download and use it. This information may include information such as</span>
      <ul>
        <li>Your device's Internet Protocol address (e.g. IP address)</li>
        <li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</li>
        <li>The time spent on the Application</li>
        <li>The operating system you use on your mobile device</li>
      </ul>
      <span>
        The Application does not gather precise information about the location of your mobile device.
      </span>
      <span>The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices and marketing promotions.</span>
      <span>For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information. The information that the Service Provider request will be retained by them and used as described in this privacy policy.</span>
      <BR />
      <HeadTitle>Third Party Access</HeadTitle>
      <span>Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.
      </span>
      <BR />
      <span>Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:</span>
      <ul>
        <li>Google Play Services The Service Provider may disclose User Provided and Automatically Collected Information:</li>
        <li>as required by law, such as to comply with a subpoena, or similar legal process;</li>
        <li>when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;</li>
        <li>with their trusted services providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.</li>
      </ul>
      <HeadTitle>Opt-Out Rights</HeadTitle>
      <span>You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.</span>
      <BR />
      <HeadTitle>Data Retention Policy</HeadTitle>
      <span>The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at siamatic.thanesgroup@gmail.com and they will respond in a reasonable time.</span>
      <BR />
      <HeadTitle>Children</HeadTitle>
      <span>The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.</span>
      <BR />
      <span>The Application does not address anyone under the age of 13. The Service Provider does not knowingly collect personally identifiable information from children under 13 years of age. In the case the Service Provider discover that a child under 13 has provided personal information, the Service Provider will immediately delete this from their servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact the Service Provider (siamatic.thanesgroup@gmail.com) so that they will be able to take the necessary actions.</span>
      <BR />
      <HeadTitle>Security</HeadTitle>
      <span>The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.</span>
      <BR />
      <HeadTitle>Changes</HeadTitle>
      <span>This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.</span>
      <BR />
      <span>This privacy policy is effective as of 2024-10-04</span>
      <BR />
      <HeadTitle>Your Consent</HeadTitle>
      <span>By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.</span>
      <BR />
      <HeadTitle>Contact Us</HeadTitle>
      <span>If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at siamatic.thanesgroup@gmail.com.</span>
    </PrivacyContainer>
  )
}

export default Policy