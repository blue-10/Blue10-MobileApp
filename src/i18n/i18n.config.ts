import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import type { Module } from 'i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { storeKeyLanguage } from '../constants';
import { inDevelopment } from '../utils/inDevelopment';
import { en } from './en';
import { nl } from './nl';

const resources = {
  en: {
    translation: en,
  },
  nl: {
    translation: nl,
  },
};

export const supportedLocales = Object.keys(resources);

const languageDetect = {
  async: true,
  cacheUserLanguage: Function.prototype,

  detect: (callback: (lng: string) => void) => {
    (async () => {
      const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
      let savedLocale: string | null = null;
      try {
        savedLocale = await SecureStore.getItemAsync(storeKeyLanguage);
      } catch {}
      const newlocale = savedLocale ?? deviceLocale;
      const finalLocale = supportedLocales.includes(newlocale) ? newlocale : 'nl';
      console.log('Detected locale:', finalLocale);
      callback(finalLocale);
    })();
  },
  init: Function.prototype,
  type: 'languageDetector',
} as Module;

i18n
  .use(initReactI18next)
  .use(languageDetect)
  .init({
    fallbackLng: inDevelopment() ? 'dev' : 'en',
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    react: {
      useSuspense: false,
    },
    resources,
    returnNull: false,
    supportedLngs: supportedLocales,
  });

export default i18n;
