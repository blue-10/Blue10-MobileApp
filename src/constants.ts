import Constants from 'expo-constants';

export const storeKeyBaseUrl = 'user.baseUrl';
export const storeKeyRefreshToken = 'user.refreshToken';
export const storeKeyLanguage = 'language.selected';
export const storeKeySettings = 'settings.values';

export const enum queryRefetchInterval {
  totalInvoices = 300000,
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
  selectableUsers = 'selectable',
  invoicesToDo = 'invoicesToDo',
  invoiceAttachments = 'invoiceAttachments',
  invoicePackingSlips = 'invoicePackingSlips',
  invoiceBookings = 'invoiceBookings',
  invoiceImageCount = 'invoiceImageCount',
  invoiceImages = 'invoiceImages',
  invoiceActions = 'invoiceActions',
  invoiceResults = 'invoiceResults',
  currentUser = 'currentUsers',
  companies = 'companies',
  getSource = 'getSource',
  newAction = 'newAction',
  overviewStatusFilters = 'overviewStatusFilters',
  invoiceImage = 'invoiceImage',
}

export const authConstants = {
  loginPage: Constants.expoConfig?.extra?.authLoginPage,
  switchEnvironment: `${Constants.expoConfig?.extra?.authLoginPage}ChangeCustomer`,
};

export const enum searchKeys {
  description = 'Description',
  status = 'Status',
  company = 'Company',
  userList = 'UserList',
  invoiceType = 'InvoiceType',
  ledgerEntryNumber = 'LedgerEntryNumber',
  documentNumber = 'DocumentNumber',
  relation = 'Relation',
  currentUser = 'CurrentUser',
  linkedToDocument = 'LinkedToDocument',
  searchOrderBy = 'SearchOrderBy',
}

export const enum searchOrderKeys {
  dateDesc = 'DateDesc',
  dateAsc = 'DateAsc',
  invoiceNrDesc = 'InvoiceNrDesc',
  invoiceNrAsc = 'InvoiceNrAsc',
  dueDateDesc = 'DueDateDesc',
  dueDateAsc = 'DueDateAsc',
  vendorDesc = 'VendorDesc',
  vendorAsc = 'VendorAsc',
}
