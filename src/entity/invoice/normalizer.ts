import type {
  GetActionsForInvoiceResponse,
  GetInvoiceAttachmentItem,
  GetInvoiceDetailsResponse,
  GetInvoiceHistoryItem,
  GetInvoiceLineItem,
  GetInvoiceOverviewResponseItem,
  GetInvoicePackingSlipItem,
} from '../../api/ApiResponses';
import { parseDate, parseDateWithMicro } from '../../utils/parseDate';
import type {
  Invoice,
  InvoiceActions,
  InvoiceAttachment,
  InvoiceHistoryItem,
  InvoiceLine,
  InvoiceListItem,
  InvoicePackingSlip,
} from './types';

export const normalizeInvoiceFromResponse = (response: GetInvoiceDetailsResponse): Invoice => {
  return {
    companyId: response.CompanyId,
    companyName: response.CompanyDisplayName,
    currency: response.Currency,
    currentUserId: response.CurrentUserId,
    entryNumber: response.WorkflowId,
    expirationDate: typeof response.DueDate === 'string' ? parseDate(response.DueDate) : undefined,
    id: response.Id,
    invoiceDate: parseDate(response.DocumentDate),
    invoiceName: response.RelationName,
    invoiceNumber: response.DocumentNumber,
    lastActionId: response.LastAction,
    lastUpdate: response.LastUpdate,
    paymentCondition: response.PaymentTerm,
    statusId: response.Status,
    subtotal: response.NetAmount,
    totalToPay: response.GrossAmount,
    userList: response.UserList ?? [],
    vatTotal: response.GrossAmount - response.NetAmount,
    excelDocumentDate: typeof response.ExcelDocumentDate === 'string' ? parseDate(response.ExcelDocumentDate) : undefined,
  };
};

export const normalizeInvoiceListItemFromResponseItem = (response: GetInvoiceOverviewResponseItem): InvoiceListItem => {
  return {
    companyName: response.CompanyDisplayName,
    currency: response.Currency,
    date: typeof response.DocumentDate === 'string' ? parseDate(response.DocumentDate) : undefined,
    id: response.Id,
    invoiceName: response.RelationName,
    invoiceNumber: response.DocumentNumber,
    price: response.GrossAmount ?? 0,
    totalCount: response.Count,
    excelDocumentDate: typeof response.ExcelDocumentDate === 'string' ? parseDate(response.ExcelDocumentDate, "yyyy-MM-dd'T'HH:mm:ss") : undefined,
  };
};

export const normalizeInvoiceAttachmentFromResponseItem = (response: GetInvoiceAttachmentItem): InvoiceAttachment => ({
  filename: response.FileName,
  id: response.Id,
});

export const normalizeInvoicePackingSlipFromResponse = (response: GetInvoicePackingSlipItem): InvoicePackingSlip => ({
  id: response.Id,
  relationCode: response.RelationCode,
  relationName: response.RelationName,
});

export const normalizeInvoiceLineFromResponse = (response: GetInvoiceLineItem): InvoiceLine => ({
  description: response.Description,
  grossAmount: response.GrossAmount,
  id: response.Id,
  ledgerNumber: response.LedgerNumber,
  netAmount: response.NetAmount,
});

export const normalizeInvoiceHistoryItemFromResponse = (response: GetInvoiceHistoryItem): InvoiceHistoryItem => ({
  action: response.Action,
  date: parseDateWithMicro(response.Date),
  fromUser: response.FromUser,
  id: response.Id,
  toUser: response.ToUser,
  userId: response.UserId,
  remark: response.Remark,
});

export const normalizeInvoiceActionsFromResponse = (response: GetActionsForInvoiceResponse): InvoiceActions => ({
  actions: response.Actions ?? [],
  suggestedAction: response.SuggestedAction,
  suggestedRemark: response.SuggestedRemark,
  suggestedUserId: response.SuggestedUserId,
  userIds: response.UserIds,
});
