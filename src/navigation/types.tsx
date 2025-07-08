export type NavigateInvoiceAnimationTypes = 'next' | 'none' | 'previous';

export type RootStackParamList = {
  Dashboard: undefined;
  SwitchEnvironment: undefined;
  Settings: undefined;
  ScanPreviewScreen: undefined;
  ScanSelectCompanyScreen: undefined;
  ScanSelectDocumentTypeScreen: undefined;
  InvoicesToDoScreen: { invoices: number } | undefined;
  InvoiceDetailsScreen: {
    id: string;
    disabledAnimation?: boolean;
    animationType?: NavigateInvoiceAnimationTypes;
  };
  InvoiceSelectUserScreen: {
    id: string;
    onlyShowUsers?: string[];
    selectedUserId?: string;
  };
  InvoiceSelectActionScreen: {
    id: string;
    onlyShowActions?: number[];
    selectedActionId?: number;
  };
  InvoiceOriginalsScreen: { id: string };
  InvoiceBookingsScreen: { id: string };
  InvoiceTimelineScreen: { id: string };
  InvoiceAttachmentAddScreen: { id: string };
  SearchFiltersScreen: undefined;
  SearchResultsScreen: undefined;
  history: undefined;
};
