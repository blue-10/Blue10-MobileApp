export const baseUrl = 'https://dummyjson.com';
export const storeKeyUserToken = 'user.token';
export const storeKeyUserName = 'user.name';
export const storeKeyUserUserId = 'user.userId';
export const storeKeyUserEnvironmentId = 'user.environmentId';
export const storeKeyUserEnvironmentName = 'user.environmentName';
export const storeKeyUserProfile = 'user.profile';

export const manualApiDelay = 2000;
export const manualShortApiDelay = 500;
export const manualVerifyTokenDelay = 2000;

export const enum queryRefetchInterval {
  totalInvoices = 300000
}

export const enum queryKeys {
  totalInvoices = 'totalInvoices',
  environments = 'environments',
  invoice = 'invoice',
  users = 'users',
  invoicesToApprove = 'invoicesToApprove',
  invoiceAttachments = 'invoiceAttachments',
  invoicePackingSlips = 'invoicePackingSlips',
  invoiceBookings = 'invoiceBookings'
}
