export type Invoice = {
  id: string;
  invoiceName: string;
  companyName: string;
  entryNumber: string;
  expirationDate?: Date;
  invoiceDate: Date;
  invoiceNumber: string;
  paymentCondition?: string;
  paymentDate?: Date;
  statusId: number;
  subtotal: number;
  totalToPay: number;
  vatTotal: number;
  companyId: string;
  currency: string;
  lastActionId: number;
  lastUpdate: string;
  currentUserId: string;
  userList: string[];
};

export type InvoiceListItem = {
  id: string;
  price: number;
  invoiceName: string;
  invoiceNumber: string;
  date?: Date;
  companyName: string;
  deadlineDate?: Date;
  currency: string;
  totalCount: number;
};

export type InvoiceAttachment = {
  id: string;
  filename: string;
};

export type InvoicePackingSlip = {
  id: string;
  relationName: string;
  relationCode: string;
};

export type InvoiceLine = {
  id: string;
  ledgerNumber: string;
  description?: string;
  grossAmount: number;
  netAmount: number;
};

export type InvoiceHistoryItem = {
  id: string;
  date: Date;
  action: number;
  actionText?: string;
  fromUser: string;
  toUser: string;
  toUserAbbreviation?: string;
  userId: string;
  userAbbreviation?: string;
  remark?: string;
};

export type InvoiceActions = {
  actions: number[];
  userIds: string[];
  suggestedAction: number;
  suggestedUserId: string;
  suggestedRemark: string;
};
