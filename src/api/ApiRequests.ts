export type GetDashboardParams = {
  CompanyIds: string[];
  DocumentTypes?: number[];
};

export type GetInvoiceOverviewParams = {
  CurrentPage: number;
  PageSize: number;
  SortAscending?: boolean;
  SortName?: string;
  PackingSlip?: string;
  PurchaseOrder?: string;
  Tag?: string;
  InvoiceType?: number;
  Relation?: string;
  DocumentNumber?: string;
  LedgerEntryNumber?: string;
  CompanyId?: string;
  CurrentUser?: string;
  LastAction?: number;
  Status?: number;
  Project?: string;
  Description?: string;
  CurrencyCode?: string;
  CostCenter?: string;
  CostUnit?: string;
  LinkedToDocument?: number;
};

export type PostNewActionParams = {
  NextAction: number;
  PreviousAction: number;
  PreviousStatus: number;
  CurrentUserId: string;
  DocumentId: string;
  DocumentType: number;
  NextUserId: string;
  Remark: string;
  AutoRouteId: string;
  RouteId: string;
  RouteOption: number;
  LastInvoiceUpdate: string;
};
