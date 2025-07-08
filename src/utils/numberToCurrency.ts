import * as Localization from 'expo-localization';

export const numberToCurrency = (value: number, currency = 'EUR') => {
  const locale = Localization.getLocales()[0]?.languageTag || 'en-US';
  const formater = new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
  });
  return formater.format(value);
};
