import { TranslationKeysType } from './i18n';

export const en: TranslationKeysType = {
  dashboard: {
    log_off: 'Log off',
    welcome_description: 'Logged in using: %{environment}',
    welcome_title: 'Hi %{name}',
  },
  invoice_details: {
    actions_title: 'Actions',
    button_bookings: 'Bookings',
    button_execute: 'Execute',
    button_originals: 'Originals',
    button_send: 'Send',
    button_send_help_text: 'Action',
    button_timeline: 'Timeline',
    button_user_help_text: 'User',
    comment: 'Comment',
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
    file_size: 'Size: %{size}',
    tab_attachments: 'Attachments',
    tab_invoice: 'Invoice',
    tab_packing_slips: 'Packing slips',
    title: 'Originals',
  },
  invoice_bookings: {
    file_size: 'Size: %{size}',
    title: 'Bookings',
  },
  invoice_timeline: {
    file_size: 'Size: %{size}',
    title: 'Timeline',
  },
  invoice_user_select: {
    title: 'User',
  },
  languages: {
    en: 'English',
    nl: 'Dutch (Nederlands)',
  },
  login: {
    email: 'Email',
    login: 'Login',
    password: 'Password',
    welcome_description: 'Login to get started',
    welcome_title: 'Hi',
  },
  logout_confirm: {
    cancel_button: 'No',
    confirm_button: 'Yes, logout',
    message: 'Are you sure want to logout?',
    title: 'Logout',
  },
  settings: {
    language_subtitle: 'Language',
    logout: 'Logout',
    screen_title: 'Settings',
  },
  switch_environments: {
    screen_title: 'Change environment',
  },
  to_approved_invoices: {
    count_results_header: {
      one: '1 result',
      other: '%{count} results',
      zero: '0 results',
    },
    screen_title: 'To approve',
  },
};
