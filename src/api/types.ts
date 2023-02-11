export type Login = {
  token: string;
  firstName: string;
}

export type Environment = {
  id: string;
  name: string;
}

export type Paging = {
  current: number;
  total: number;
  previous?: number;
  next?: number;
  totalResults: number;
}

export type InvoicesToApprove = {
  invoices: InvoiceToApprove[];
  paging: Paging;
}

export type InvoiceToApprove = {
  id: string;
  price: number;
  invoiceNr: string;
  date: Date;
  companyName: string;
  deadlineDate?: Date;
  status?: string;
}

export type Invoice = {
  id: string;
  companyName: string;
  companySubTitle: string;
  entryNumber: string;
  expirationDate: string;
  invoiceDate: string;
  invoiceNumber: string;
  paymentCondition: string;
  paymentDate: string;
  status: string;
  subtotal: string;
  totalToPay: string;
  vatTotal: string;
}

export type User = {
  id: string;
  name: string;
}

export type InvoiceAttachment = {
  id: string;
  name: string;
  fileSize: number;
}

export type InvoicePackingSlip = {
  id: string;
  name: string;
  fileSize: number;
}
