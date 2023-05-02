import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import i18n, { Module } from 'i18next';
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
  detect: async () => {
    // grab locale that the device is using.
    const deviceLocale = Localization.locale.split('-')[0];
    // look up in the store for the saved locale
    const savedLocale = await SecureStore.getItemAsync(storeKeyLanguage);
    // check if saved locale is not null if so we use the device version
    const newlocale = (savedLocale !== null) ? savedLocale : deviceLocale;

    // check if locale can be used for the application else fallback to dutch.
    return supportedLocales.includes(newlocale) ? newlocale : 'nl';
  },
  init: Function.prototype,
  type: 'languageDetector',
} as Module;

i18n.use(initReactI18next)
  .use(languageDetect)
  .init({
    fallbackLng: inDevelopment() ? 'dev' : 'en',
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    resources,
    returnNull: false,
    supportedLngs: supportedLocales,
  });

export default i18n;
