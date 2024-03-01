import * as Localization from 'expo-localization';

export const numberToCurrency = (value: number, currency = 'EUR') => {
  const formater = new Intl.NumberFormat(Localization.locale, {
    currency,
    style: 'currency',
  });
  return formater.format(value);
};
