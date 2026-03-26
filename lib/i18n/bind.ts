import type { i18n as I18nInstance } from 'i18next'
import i18n from './instance'

type BindableI18n = Pick<I18nInstance, 'language' | 'resolvedLanguage' | 'on' | 'off'>

const getLanguage = ({ resolvedLanguage, language }: BindableI18n) => resolvedLanguage ?? language

// Allows a consumer app to do `bindI18n(i18nInstance)` so that the
// agent UI instance stays in sync when language changes.
export const bindI18n = (consumerI18n: BindableI18n) => {
  const syncLanguage = (language?: string) => {
    if (!language || getLanguage(i18n) === language) {
      return
    }

    void i18n.changeLanguage(language)
  }

  const handleLanguageChanged = (language: string) => {
    syncLanguage(language)
  }

  syncLanguage(getLanguage(consumerI18n))

  consumerI18n.on('languageChanged', handleLanguageChanged)

  return () => {
    consumerI18n.off('languageChanged', handleLanguageChanged)
  }
}
