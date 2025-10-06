import type { PagedItem } from '../entity/system/types';

export type RefreshAccessTokenResponse = {
  Token: string;
  CustomerId: string;
  CustomerName: string;
  IsReadOnly: boolean;
  RefreshAfterSeconds: number;
  Domain: string;
};

export type RefreshRefreshTokenResponse = RefreshAccessTokenResponse;

export type GetCurrentUserResponse = {
  FirstNAme: string;
  LastName: string;
  Locale: string;
  LastNotification?: Date;
  DateCreated: Date;
  UseNewClient: boolean;
  ContractManagementEnabled: boolean;
  ReceivesContractManagementNotifications: boolean;
  LinkedToWorkflowUser: boolean;
  IsInMultipleEnvironments: boolean;
  UserViewRights: number[];
  UserActionRights: number[];
  MaximumApprovalAmount: number;
  MayDeleteAttachments: number;
  RoleIds: number[];
  Id: string;
  Name: string;
  Abbreviation: string;
  Email: string;
  BaseRole: number;
  IsActive: boolean;
  isGroup: boolean;
  isDeleted: boolean;
  isAdmin: boolean;
  BelongsTo: string;
  NotificationFrequency: number;
  SearchRights: number;
  MayHandleAllCompanies: boolean;
  MaySignAllCompanies: boolean;
  MayApproveAllCompanies: boolean;
  MaySeeAllCompanies: boolean;
  MayValidateAllCompanies: boolean;
  ValidateDocumentsWithoutCompany: boolean;
  ValidateBatchesWithoutCompany: boolean;
  SeeCompanies: any[]; // unknown yet
  ValidateCompanies: any[]; // unknown yet
  ApproveCompanies: any[];
  HandleCompanies: any[];
  SignCompanies: any[];
  ReplacingUserIds: any[];
  MaySeeOtherUsers: boolean;
  MaySeeOtherCompanies: boolean;
  MaySeeAllDocuments: boolean;
  MaySeeAlreadySeen: boolean;
  MayEditDocuments: boolean;
  MayDeleteDocuments: boolean;
  MaySeeConfidentialDocuments: boolean;
  SeeDocumentsWithPurchaseOrder: boolean;
  Selectable: boolean;
};

export type GetDashboardResponse = DashboardResponseItem[];

export type DashboardResponseItem = {
  Name: number;
  Count: number;
  DashboardSubItems: DashboardResponseSubItem[];
  ArrowCount: number;
  RuleStatus: number;
};

export type DashboardResponseSubItem = {
  StepStatus: number;
  CompanyId: string;
  Confidential: number;
  Blocked: number;
  Count: number;
  OutstandingAmount: number;
  Currency: string;
  RuleStatus: number;
};

export type GetCompanyResponse = GetCompanyResponseItem[];

export type GetCompanyResponseItem = {
  VatNumber: string;
  IsVatDeductible: boolean;
  AllowOverrideVatDeductible: boolean;
  VatDeductibleCode: string;
  PurchaseOrderLedgerCode: string;
  TargetAdministrations: any[];
  Ibans: any[];
  ChamberOfCommerceNumber: string;
  ErpVariable1: string;
  ErpVariable2: string;
  FeaturesErpAdapterId: string;
  FeaturesLogisticsAdapterId: string;
  UsesErpExtraVariable1: boolean;
  UsesErpExtraVariable2: boolean;
  UsesErpExtraVariable3: boolean;
  DefaultPurchaseJournal: string;
  DefaultSalesJournal: string;
  DefaultDebtorsAccount: string;
  DefaultCreditorsAccount: string;
  UsesVerifyFreeField1: boolean;
  UsesVerifyFreeField2: boolean;
  Id: string;
  Name: string;
  DisplayName: string;
  Country: string;
  IsDeleted: boolean;
  ErpAdapter: number;
  LogisticsAdapter: number;
  UsesSalesInvoices: boolean;
  UsesPackingSlips: boolean;
  ErpLoginStatus: number;
  Currency: string;
  IsOnlineErpAdapter: boolean;
  SupportsCoding: boolean;
  CodingProperties: number[];
};

export type GetInvoiceOverviewResponse = GetInvoiceOverviewResponseItem[];

export type GetInvoiceOverviewResponseItem = PagedItem & {
  Id: string;
  LastAction: number;
  DocumentNumber: string;
  DocumentType: number;
  RelationCode: string;
  RelationName: string;
  CurrentUserId: string;
  UserList?: string[];
  LedgerEntryNumber: string;
  CompanyId: string;
  CompanyDisplayName: string;
  NetAmount: number;
  GrossAmount?: number;
  Currency: string;
  InvoiceType: number;
  IsApproved: boolean;
  ApprovedBy: string;
  DocumentDate: string;
  ImportDate: string;
  PaymentDate?: string;
  DueDate?: string | null;
  LastHistory: string;
  ExcelDocumentDate?: string;
};

export type GetInvoiceDetailsResponse = {
  Id: string;
  CodeInErp: boolean;
  CodingErrors: string;
  CodingStatus: number;
  CompanyDisplayName: string;
  CompanyId: string;
  Currency: string;
  CurrentUserId: string;
  UserList?: string[];
  DocumentDate: string;
  DocumentNumber: string;
  DocumentType: number;
  DueDate: string | null;
  ExcelDocumentDate: string;
  ErpAdapter: number;
  ErrorMessage: string;
  FreeField1: string;
  FreeField2: string;
  GrossAmount: number;
  HandlerId: string;
  ImportDate: null;
  InvoiceType: number;
  IsApproved: boolean;
  IsBlocked: boolean;
  IsConfidential: boolean;
  IsDisabledForAutoRouter: boolean;
  IsInErp: boolean;
  IsPaid: boolean;
  IsPosted: boolean;
  IsPostedInWorkflow: boolean;
  IsWaitingForErp: boolean;
  LastAction: number;
  LastErpLineUpdate: null;
  LastUpdate: string;
  LedgerEntryNumber: string;
  LinkToErpInvoice: '';
  LinkedPackingSlips: number;
  MatchedPurchaseOrders: number;
  NetAmount: number;
  NumberOfAttachments: number;
  PackingSlipNumbers: [];
  PaymentDate: string | null;
  PaymentDateIsNotAvailable: boolean;
  PaymentDiscount: number;
  PaymentDiscountExpirationDate: string | null;
  PaymentDiscountPercentage: number;
  PaymentReference: string;
  PaymentTerm: string;
  PaymentTermCode: string;
  Period: string;
  PurchaseOrderNumbers: any[];
  RelationCode: string;
  RelationContractManagementId: string;
  RelationId: string;
  RelationName: string;
  ReportingDate: string;
  ScannedPurchaseOrderNumbers: any[];
  ScannedPurchaseOrders: string;
  SourceDocumentId: string;
  SourceType: number;
  Status: number;
  VatCategory: string;
  WorkflowId: string;
};

export type GetInvoiceImageResponse = {
  Id: string;
  Image: string;
  Rotation: string;
};

export type GetInvoiceAttachmentResponse = GetInvoiceAttachmentItem[];

export type GetInvoiceAttachmentItem = {
  Id: string;
  FileName: string;
  CanDelete: boolean;
};

export type GetInvoicePackingSlipResponse = GetInvoicePackingSlipItem[];

export type GetInvoicePackingSlipItem = {
  Id: string;
  DocumentNumber: string;
  WorkflowId: string;
  DocumentType: number;
  CompanyId: string;
  SourceDocumentId: string;
  CostCenter: string;
  CostUnit: string;
  PurchaseOrderNumbers: string;
  DocumentDate: string;
  ImportDate: string;
  RelationId: string;
  RelationCode: string;
  RelationName: string;
  RelationContractManagementId: string;
  CompanyDisplayName: string;
  ErpAdapter: number;
};

export type GetInvoiceLinesResponse = GetInvoiceLineItem[];

export type GetInvoiceLineItem = {
  Id: string;
  InvoiceId: string;
  LineNumber: number;
  PurchaseOrder: string;
  PurchaseOrderLine: string;
  GrossAmount: number;
  NetAmount: number;
  VatBaseAmount: number;
  VatAmount: number;
  LedgerNumber: string;
  LedgerType: string;
  LedgerPeriod: string;
  VatCode: string;
  VatIsInclusive: boolean;
  Description: string;
  CostCenter: string;
  CostUnit: string;
  Date?: string;
  ReportingDate?: any;
  UserId: string;
  VatShifted: boolean;
  Quantity: number;
  DistributionCode: string;
  Project: string;
  Article: string;
  Warehouse: string;
  PricePerUnit: number;
  DiscountPercentage: number;
  TargetAdministration: string;
  DeferredFrom?: any;
  DeferredTo?: any;
  DeferredCode: string;
  FreeField1: string;
  FreeField2: string;
  FreeAllocation1: string;
  FreeAllocation2: string;
  VatNonDeductiblePercentage: number;
  ProjectExpenseDescription: string;
  RebillProject: boolean;
  Asset: string;
  DryMatterPercentage: number;
  Weight: number;
};

export type GetInvoiceHistoryResponse = GetInvoiceHistoryItem[];

export type GetInvoiceHistoryItem = {
  Id: string;
  Date: string;
  Action: number;
  FromUser: string;
  ToUser: string;
  Remark: string;
  UserId: string;
  ByRoute: boolean;
};

export type getAllUsersResponse = UserResponseItem[];

export type UserResponseItem = {
  Id: string;
  Name: string;
  Abbreviation: string;
  Email: string;
  BaseRole: number;
  IsActive: boolean;
  IsGroup: boolean;
  IsDeleted: boolean;
  IsAdmin: boolean;
  BelongsTo: string;
  NotificationFrequency: number;
  SearchRights: number;
  MayHandleAllCompanies: boolean;
  MaySignAllCompanies: boolean;
  MayApproveAllCompanies: boolean;
  MaySeeAllCompanies: boolean;
  MayValidateAllCompanies: boolean;
  ValidateDocumentsWithoutCompany: boolean;
  ValidateBatchesWithoutCompany: boolean;
  SeeCompanies: any[];
  ValidateCompanies: any[];
  ApproveCompanies: any[];
  HandleCompanies: any[];
  SignCompanies: any[];
  MaySeeOtherUsers: boolean;
  MaySeeOtherCompanies: boolean;
  MaySeeAllDocuments: boolean;
  MaySeeAlreadySeen: boolean;
  MayEditDocuments: boolean;
  MayDeleteDocuments: boolean;
  MaySeeConfidentialDocuments: boolean;
  SeeDocumentsWithPurchaseOrder: boolean;
  Selectable: boolean;
};

export type GetSourceResponse = Record<string, string>;

export type GetActionsForInvoiceResponse = {
  DocumentId: string;
  DocumentType: string;
  Actions?: number[];
  UserIds: string[];
  ApprovalAmount: number;
  UsesRoutes: boolean;
  SuggestedAction: number;
  SuggestedUserId: string;
  SuggestedRemark: string;
  Route: {
    Id: string;
    ActionId: number;
    CurrentUserId: string;
    SendToUserId: string;
    DefaultText: string;
    IsUserRoute: boolean;
    RouteOption: number;
    LastAction: number;
    Status: number;
  };
};

export type PostNewActionErrorResponse = {
  Message: string;
};
