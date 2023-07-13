import Constants from 'expo-constants';

export const storeKeyBaseUrl = 'user.baseUrl';
export const storeKeyRefreshToken = 'user.refreshToken';
export const storeKeyLanguage = 'language.selected';

export const enum queryRefetchInterval {
  totalInvoices = 300000
}

export const lngConvert: Record<string, string> = {
  en: 'en-US',
  nl: 'nl-NL',
};

export const enum queryKeys {
  totalInvoices = 'totalInvoices',
  environments = 'environments',
  invoice = 'invoice',
  users = 'users',
  invoicesToApprove = 'invoicesToApprove',
  invoiceAttachments = 'invoiceAttachments',
  invoicePackingSlips = 'invoicePackingSlips',
  invoiceBookings = 'invoiceBookings',
  invoiceImageCount = 'invoiceImageCount',
  invoiceImages = 'invoiceImages',
  invoiceActions = 'invoicActions',
  currentUser = 'currentUsers',
  companies = 'companies',
  getSource = 'getSource',
  newAction = 'newAction'
}

export const authConstants = {
  loginPage: Constants.expoConfig?.extra?.authLoginPage,
  switchEnvironment: Constants.expoConfig?.extra?.authLoginPage + 'ChangeCustomer',
};

export const apiConversion: Record<string, string> = {
  'https://d1.blue10development.com': 'https://d1-ws.blue10development.com',
  'https://d1-classic.blue10development.com': 'https://d1-ws.blue10development.com',
  'https://d2.blue10development.com': 'https://d2-ws.blue10development.com',
  'https://d2-classic.blue10development.com': 'https://d2-ws.blue10development.com',
  'https://d3.blue10development.com': 'https://d3-ws.blue10development.com',
  'https://d3-classic.blue10development.com': 'https://d3-ws.blue10development.com',

  // production domains
  'https://eu1.blue10.com/': 'https://eu1-ws.blue10.com',
  'https://eu2.blue10.com/': 'https://eu2-ws.blue10.com',
  'https://eu3.blue10.com/': 'https://eu3-ws.blue10.com',
  'https://eu4.blue10.com/': 'https://eu4-ws.blue10.com',
  'https://eu5.blue10.com/': 'https://eu5-ws.blue10.com',
  'https://eu6.blue10.com/': 'https://eu6-ws.blue10.com',
  'https://eu7.blue10.com/': 'https://eu7-ws.blue10.com',
  'https://eu8.blue10.com/': 'https://eu8-ws.blue10.com',
  'https://eu9.blue10.com/': 'https://eu9-ws.blue10.com',
};
