/* eslint-disable max-len */
import type { TranslationKeysType } from './types';

export const en: TranslationKeysType = {
  company_select: {
    modal_title: 'Select a company',
  },
  dashboard: {
    log_off: 'Log off',
    title: 'Dashboard',
    welcome_description: 'Logged in using: {{environment}}',
    welcome_title: 'Hi {{name}}',
  },
  error_view: {
    description:
      'Something happened in the application that we could not recover. If this happens again please use the log off button below',
    logout_button: 'Log off',
    reload_button: 'Restart appliccation',
    title: 'Something went wrong.',
  },
  fetch_error_message: {
    button_retry: 'Retry',
    description: 'Something went wrong when getting information. Please try again.',
    title: 'Something went wrong!',
  },
  general: {
    button_cancel: 'Cancel',
    button_ok: 'OK',
    error: 'Error',
    search_placeholder: 'Zoeken...',
    unknown: 'Unknown',
  },
  invoice_action_form: {
    action_completed_title: 'Action completed',
    button_action_help_text: 'Action',
    button_user_help_text: 'User',
    comment: 'Comment',
    no_action_selected: '(No action selected)',
    no_user_selected: '(No user selected)',
    title: 'Actions',
  },
  invoice_action_select: {
    title: 'Actions',
  },
  invoice_attachments: {
    add_button: 'Add scan',
  },
  invoice_attachnment_add: {
    title: 'Add scan',
  },
  invoice_booking_item: {
    bruto: 'Gross amount:',
    netto: 'Net amount:',
  },
  invoice_bookings: {
    file_size: 'Size: {{size}}',
    title: 'Bookings',
  },
  invoice_details: {
    button_bookings: 'Bookings',
    button_execute: 'Execute',
    button_originals: 'Originals',
    button_timeline: 'Timeline',
    entry_number: 'Entrynumber',
    expiration_date: 'Expiration date',
    invoice_date: 'Invoice date',
    invoice_number: 'Invoicenumber',
    next_button: 'Next',
    payment_condition: 'Condition',
    payment_date: 'Payment date',
    previous_button: 'Previous',
    status: 'Status',
    sub_total: 'Cost',
    title: 'Invoice',
    total_to_pay: ' Total to pay',
    vat_total: 'VAT',
  },
  invoice_originals: {
    file_size: 'Size: {{size}}',
    tab_attachments: 'Attachments',
    tab_invoice: 'Invoice',
    tab_packing_slips: 'Packing slips',
    title: 'Originals',
  },
  invoice_timeline: {
    file_size: 'Size: {{size}}',
    title: 'Timeline',
  },
  invoice_timeline_item: {
    action: 'Action',
    date: 'Date',
  },
  invoice_user_select: {
    title: 'User',
  },
  languages: {
    en: 'English',
    nl: 'Dutch',
  },
  list_header: {
    last_updated_at: 'Last updated',
  },
  listview_empty: {
    title: 'No results',
  },
  login: {
    email: 'Email',
    login: 'Login',
    password: 'Password',
    welcome_description: 'Login to get started',
    welcome_title: 'Hi',
  },
  login_site: {
    loading: 'Loading...',
  },
  login_site_error: {
    retry_button: 'Try again',
    title: 'Something went wrong',
  },
  logout_confirm: {
    cancel_button: 'No',
    confirm_button: 'Yes, logout',
    message: 'Are you sure want to logout?',
    title: 'Logout',
  },
  overview_status_select: {
    modal_title: 'Select a option',
  },
  scan: {
    company_title: 'Select company',
    document_type_packing_slip: 'Packing slip',
    document_type_purchase_invoice: 'Purchase invoice',
    document_type_sales_invoice: 'Sales invoice',
    document_type_title: 'Select document type',
    document_type_undefined: 'Unknown',
    menu_cancel: 'Cancel',
    menu_dashboard: 'Dashboard',
    menu_select_company: 'Change company',
    menu_select_document_type: 'Change document type',
    menu_title: 'Settings',
    preview_title: 'BLUE10 SCAN',
    preview_upload_failed_title: 'UPLOAD FAILED!',
    preview_upload_success_title: 'UPLOAD SUCCEEDED!',
    screen_title: 'Scan',
    upload_busy_toast: 'Please wait for the upload to finish...',
    upload_finalize_warning:
      'The document was uploaded successfully, but there was an error finalizing the upload session.',
    upload_generate_document_error: 'An error occurred while converting the images into a PDF document.',
    upload_start_session_error: 'An error occurred while starting the upload session.',
    upload_success: 'Your scan was uploaded successfully.',
    upload_table_company: 'Company',
    upload_table_customer: 'Customer',
    upload_table_document_type: 'Document type',
    upload_table_images: 'Images',
    upload_table_user: 'User',
    upload_title: 'UPLOAD SCAN',
    upload_upload_error: 'An error occurred while uploading the document to the server.',
    upload_user_aborted: 'Upload process aborted.',
  },
  search: {
    results_title: 'Results',
    screen_title: 'Search',
  },
  search_filter: {
    button_search: 'Search',
    company_label: 'Company',
    company_placeholder: 'All companies',
    document_number_label: 'Document number',
    invoice_type_credit: 'Credit',
    invoice_type_debit: 'Debit',
    invoice_type_label: 'Kind',
    ledger_entry_number_label: 'Bookingnumber',
    relation_label: 'Supplier',
    search_placeholder: 'Search...',
    status_label: 'Overview',
    status_placeholder: 'All',
    title: 'Find a invoice',
    user_label: 'User',
    user_placeholder: 'No user selected',
  },
  settings: {
    language_subtitle: 'Language',
    logout: 'Logout',
    screen_title: 'Settings',
    version: 'Version',
  },
  switch_environments: {
    screen_title: 'Change environment',
  },
  to_do_invoices: {
    count_results_header_one: '1 result',
    count_results_header_other: '{{count}} results',
    count_results_header_zero: '0 results',
    screen_title: 'To-do',
  },
  user_select: {
    modal_title: 'Select a user',
  },
};
