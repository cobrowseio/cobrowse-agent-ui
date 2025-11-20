import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { formatDistanceToNow } from 'date-fns'
import {
  enUS, ar, cs, da, de, es, et, fi, fr, hi, it, ja, ko, lt, ms, nl, pl, pt, ro, ru, sk, sl, sv, th, uk, vi, zhCN
} from 'date-fns/locale'
import localeEnUS from './locales/en-us/translation.json'
import localeAr from './locales/ar/translation.json'
import localeCs from './locales/cs/translation.json'
import localeDa from './locales/da/translation.json'
import localeDe from './locales/de/translation.json'
import localeEs from './locales/es/translation.json'
import localeEt from './locales/et/translation.json'
import localeFi from './locales/fi/translation.json'
import localeFr from './locales/fr/translation.json'
import localeHi from './locales/hi/translation.json'
import localeIt from './locales/it/translation.json'
import localeJa from './locales/ja/translation.json'
import localeKk from './locales/kk/translation.json'
import localeKo from './locales/ko/translation.json'
import localeLt from './locales/lt/translation.json'
import localeMr from './locales/mr/translation.json'
import localeMs from './locales/ms/translation.json'
import localeNl from './locales/nl/translation.json'
import localePl from './locales/pl/translation.json'
import localePt from './locales/pt/translation.json'
import localeRo from './locales/ro/translation.json'
import localeRu from './locales/ru/translation.json'
import localeSk from './locales/sk/translation.json'
import localeSl from './locales/sl/translation.json'
import localeSv from './locales/sv/translation.json'
import localeTh from './locales/th/translation.json'
import localeUk from './locales/uk/translation.json'
import localeVi from './locales/vi/translation.json'
import localeZh from './locales/zh/translation.json'

const englishUS = 'en-us'

const dateLocales = {
  [englishUS]: enUS,
  ar,
  cs,
  da,
  de,
  es,
  et,
  fi,
  fr,
  hi,
  it,
  ja,
  ko,
  lt,
  ms,
  nl,
  pl,
  pt,
  ro,
  ru,
  sk,
  sl,
  sv,
  th,
  uk,
  vi,
  zh: zhCN
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
  detection: {
    caches: [],
    order: []
  },
  resources: {
    [englishUS]: {
      translation: localeEnUS
    },
    ar: {
      translation: localeAr
    },
    cs: {
      translation: localeCs
    },
    da: {
      translation: localeDa
    },
    de: {
      translation: localeDe
    },
    es: {
      translation: localeEs
    },
    et: {
      translation: localeEt
    },
    fi: {
      translation: localeFi
    },
    fr: {
      translation: localeFr
    },
    hi: {
      translation: localeHi
    },
    it: {
      translation: localeIt
    },
    ja: {
      translation: localeJa
    },
    kk: {
      translation: localeKk
    },
    ko: {
      translation: localeKo
    },
    lt: {
      translation: localeLt
    },
    mr: {
      translation: localeMr
    },
    ms: {
      translation: localeMs
    },
    nl: {
      translation: localeNl
    },
    pl: {
      translation: localePl
    },
    pt: {
      translation: localePt
    },
    ro: {
      translation: localeRo
    },
    ru: {
      translation: localeRu
    },
    sk: {
      translation: localeSk
    },
    sl: {
      translation: localeSl
    },
    sv: {
      translation: localeSv
    },
    th: {
      translation: localeTh
    },
    uk: {
      translation: localeUk
    },
    vi: {
      translation: localeVi
    },
    zh: {
      translation: localeZh
    }
  }
})

i18n
  .use(initReactI18next)
  .init()

export default i18n
