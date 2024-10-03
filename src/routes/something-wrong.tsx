import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate, useRouteError } from "react-router-dom"
import { SomethingWrongPageStyled } from "../style/components/error.page"

export default function SomethingWrong() {
  const { t, i18n } = useTranslation()
  const pathName = useLocation()
  const navigate = useNavigate()
  const error = useRouteError()
  const langs = localStorage.getItem("lang")
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  useEffect(() => {
    if (error) {
      const err = error as unknown as { message: string }
      setErrorText(String(err.message))
      console.error(error)
    }
  }, [error])

  return (
    <SomethingWrongPageStyled>
      <h1>{t('titleError')}</h1>
      <p>{t('descriptionErrorWrong')}</p>
      <pre>
        {errorText.toString()}
      </pre>
      <p>
        {
          pathName.pathname !== '/' && <i onClick={() => navigate('/')}>{t('buttonErrorBack')}</i>
        }
      </p>
    </SomethingWrongPageStyled>
  )
}
