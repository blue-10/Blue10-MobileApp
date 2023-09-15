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
