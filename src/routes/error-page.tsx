import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"
import { ErrorPageStyled, TabLightPage } from "../style/components/error.page"
import { RiEmotionUnhappyFill } from "react-icons/ri"
import { useTheme } from "../theme/ThemeProvider"

export default function ErrorPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const langs = localStorage.getItem("lang")
  const { theme } = useTheme()

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  useEffect(() => {
    const changeFavicon = (href: string) => {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/png'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
    }

    changeFavicon('Logo_SM_WBG.jpg')
  }, [])

  return (
    <ErrorPageStyled>
      <div>
      </div>
      <div>
        <TabLightPage $bgColor="rgba(200, 200, 0, 0.4)" $shadowColor="rgba(200, 200, 0, 0.7)" $disbleBg={false} />
        <RiEmotionUnhappyFill size={64} color={theme.mode === 'dark' ? 'Yellow' : 'var(--main-dark-color)'} />
        <span>{t('titleError')}</span>
        <div>
          <span>404</span>
          <p>{t('descriptionError')}</p>
          <p>
            <button onClick={() => navigate('/')}>{t('buttonErrorBack')}</button>
          </p>
        </div>
      </div>
    </ErrorPageStyled>
  )
}