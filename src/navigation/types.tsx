export type RootStackParamList = {
  Dashboard: undefined;
  SwitchEnvironment: undefined;
  Settings: undefined;
  InvoicesToApproveScreen: { invoices: number } | undefined;
  InvoiceDetailsScreen: { id: string };
  InvoiceSelectUserScreen: { id: string };
  InvoiceOriginalsScreen: { id: string };
};
