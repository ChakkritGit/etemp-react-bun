// import { useTranslation } from 'react-i18next'
// import { ClosePromptToastButton, ReloadPromptButton, ReloadPromptContainer, ReloadPromptMessage, ReloadPromptToast, ReloadPromptToastButton } from '../../style/components/reloadprompt'
// import { useRegisterSW } from 'virtual:pwa-register/react'

// export default function ReloadPrompt() {
//   const { t } = useTranslation()

//   const {
//     offlineReady: [offlineReady, setOfflineReady],
//     needRefresh: [needRefresh, setNeedRefresh],
//     updateServiceWorker,
//   } = useRegisterSW({
//     onRegistered(r) {
//       // eslint-disable-next-line prefer-template
//       close()
//       console.log('SW Registered: ' + r)
//     },
//     onRegisterError(error) {
//       console.log('SW registration error', error)
//     },
//   })

//   const close = () => {
//     setOfflineReady(false)
//     setNeedRefresh(false)
//   }

//   return (
//     <ReloadPromptContainer>
//       {(offlineReady || needRefresh)
//         && <ReloadPromptToast>
//           <ReloadPromptMessage>
//             {offlineReady
//               ? <span>{t('appOffline')}</span>
//               : <span>{t('newContentReload')}</span>
//             }
//           </ReloadPromptMessage>
//           <ReloadPromptButton>
//             {needRefresh &&
//               <ReloadPromptToastButton onClick={() => updateServiceWorker(true)}>{t('reloadButton')}</ReloadPromptToastButton>
//             }
//             <ClosePromptToastButton onClick={() => close()}>{t('closeButton')}</ClosePromptToastButton>
//           </ReloadPromptButton>
//         </ReloadPromptToast>
//       }
//     </ReloadPromptContainer>
//   )
// }