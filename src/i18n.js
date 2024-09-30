import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { formatDistanceToNow } from 'date-fns'
import { enUS, es, fr } from 'date-fns/locale'
import localeEnUS from './locales/en-us/translation.json'
import localeEs from './locales/es/translation.json'
import localeFr from './locales/fr/translation.json'

const englishUS = 'en-us'

const dateLocales = {
  [englishUS]: enUS,
  es,
  fr
}

const i18n = createInstance({
  fallbackLng: englishUS,
  debug: process.env.NODE_ENV === 'development',
  lowerCaseLng: true,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
    format: (value, format, lng) => {
      if (format === 'dateRelative' && value instanceof Date) {
        const locale = dateLocales[lng] || enUS
        return formatDistanceToNow(value, { addSuffix: true, locale })
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

export default i18n
