import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import moment from 'moment'
import 'moment/locale/es'
import 'moment/locale/fr'
import localeEnUS from './locales/en-us/translation.json'
import localeEs from './locales/es/translation.json'
import localeFr from './locales/fr/translation.json'

const englishUS = 'en-us'
const spanish = 'es'
const french = 'fr'
const SUPPORTED_LOCALES = [englishUS, spanish, french]

const i18n = createInstance({
  fallbackLng: englishUS,
  debug: process.env.NODE_ENV === 'development',
  lowerCaseLng: true,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
    format: (value, format) => {
      if (format === 'dateRelative' && moment(value).isValid()) {
        return moment(value).fromNow()
      }
    }
  },

  resources: {
    'en-us': {
      translation: localeEnUS
    },
    es: {
      translation: localeEs
    },
    fr: {
      translation: localeFr
    }
  }
})

i18n
  .use(initReactI18next)
  .init()

// Default to English on load
moment.locale(englishUS)

i18n.on('languageChanged', (language) => {
  // Fall back to US English if we don't currently support the selected language
  if (SUPPORTED_LOCALES.indexOf(language) === -1) {
    moment.locale(englishUS)
    return
  }

  moment.locale(language)
})

export default i18n
