export type RootStackParamList = {
  Dashboard: undefined;
  SwitchEnvironment: undefined;
  Settings: undefined;
  ScanCameraScreen: {
    addImageHandler: (image: any) => void;
    isBlackWhiteModeEnabled: boolean;
    isDocumentRecognitionEnabled: boolean;
    isFlashEnabled: boolean;
  };
  ScanPreviewScreen: undefined;
  InvoicesToApproveScreen: { invoices: number } | undefined;
  InvoiceDetailsScreen: { id: string; disabledAnimation?: boolean };
  InvoiceSelectUserScreen: { id: string; onlyShowUsers?: string[]; selectedUserId?: string};
  InvoiceSelectActionScreen: { id: string; onlyShowActions?: number[]; selectedActionId?: number};
  InvoiceOriginalsScreen: { id: string };
  InvoiceBookingsScreen: { id: string };
  InvoiceTimelineScreen: { id: string };
};
