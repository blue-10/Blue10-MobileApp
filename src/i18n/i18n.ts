import * as Localization from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';

import { en } from './en';
import { nl } from './nl';

type CountType = {
  zero: string;
  one: string;
  other: string;
};

export type TranslationKeysType = {
  login: {
    welcome_title: string;
    welcome_description: string;
    email: string;
    password: string;
    login: string;
  };
  dashboard: {
    log_off: string;
    welcome_title: string;
    welcome_description: string;
  };
  to_approved_invoices: {
    screen_title: string;
    count_results_header: CountType;
  };
  switch_environments: {
    screen_title: string;
  };
  invoice_details: {
    title: string;
    next_button: string;
    previous_button: string;
    status: string;
    invoice_date: string;
    expiration_date: string;
    payment_date: string;
    invoice_number: string;
    entry_number: string;
    payment_condition: string;
    sub_total: string;
    vat_total: string;
    total_to_pay: string;
    button_originals: string;
    button_bookings: string;
    button_timeline: string;
    button_execute: string;
    button_send: string;
    actions_title: string;
    button_send_help_text: string;
    button_user_help_text: string;
    comment: string;
  };
  invoice_user_select: {
    title: string;
  };
  invoice_originals: {
    title: string;
    tab_invoice: string;
    tab_attachments: string;
    tab_packing_slips: string;
    file_size: string;
  };
  invoice_bookings: {
    title: string;
    file_size: string;
  };
  invoice_timeline: {
    title: string;
    file_size: string;
  };
  settings: {
    screen_title: string;
    language_subtitle: string;
    logout: string;
  };
  languages: {
    nl: string;
    en: string;
  };
  logout_confirm: {
    title: string;
    message: string;
    confirm_button: string;
    cancel_button: string;
  };
};

export const translationKeys = {
  dashboard: {
    log_off: 'dashboard.log_off',
    welcome_description: 'dashboard.welcome_description',
    welcome_title: 'dashboard.welcome_title',

  },
  invoice_details: {
    actions_title: 'invoice_details.actions_title',
    button_bookings: 'invoice_details.button_bookings',
    button_execute: 'invoice_details.button_execute',
    button_originals: 'invoice_details.button_originals',
    button_send: 'invoice_details.button_send',
    button_send_help_text: 'invoice_details.button_send_help_text',
    button_timeline: 'invoice_details.button_timeline',
    button_user_help_text: 'invoice_details.button_user_help_text',
    comment: 'invoice_details.comment',
    entry_number: 'invoice_details.entry_number',
    expiration_date: 'invoice_details.expiration_date',
    invoice_date: 'invoice_details.invoice_date',
    invoice_number: 'invoice_details.invoice_number',
    next_button: 'invoice_details.next_button',
    payment_condition: 'invoice_details.payment_condition',
    payment_date: 'invoice_details.payment_date',
    previous_button: 'invoice_details.previous_button',
    status: 'invoice_details.status',
    sub_total: 'invoice_details.sub_total',
    title: 'invoice_details.title',
    total_to_pay: 'invoice_details.total_to_pay',
    vat_total: 'invoice_details.vat_total',
  },
  invoice_originals: {
    file_size: 'invoice_originals.file_size',
    tab_attachments: 'invoice_originals.tab_attachments',
    tab_invoice: 'invoice_originals.tab_invoice',
    tab_packing_slips: 'invoice_originals.tab_packing_slips',
    title: 'invoice_originals.title',
  },
  invoice_bookings: {
    file_size: 'invoice_bookings.file_size',
    title: 'invoice_bookings.title',
  },
  invoice_timeline: {
    file_size: 'invoice_timeline.file_size',
    title: 'invoice_timeline.title',
  },
  invoice_user_select: {
    title: 'invoice_user_select.title',
  },
  login: {
    email: 'login.email',
    login: 'login.login',
    password: 'login.password',
    welcome_description: 'login.welcome_description',
    welcome_title: 'login.welcome_title',
  },
  switch_environments: {
    screen_title: 'switch_environments.screen_title',
  },
  to_approved_invoices: {
    count_results_header: 'to_approved_invoices.count_results_header',
    screen_title: 'to_approved_invoices.screen_title',
  },
};

const i18n = new I18n({
  en,
  nl,
});

type TranslationKeysTypePaths = PathsToProps<TranslationKeysType, CountType | string>

export const t = (scope: TranslationKeysTypePaths, options?: TranslateOptions) =>
  i18n.translate(scope as unknown as string, options);

// Set the locale once at the beginning of your app.
// i18n.locale = Localization.locale;
i18n.locale = 'nl'; // force to dutch for demo purposes.
i18n.defaultLocale = 'nl';
i18n.enableFallback = true;

export default i18n;

export const numberToEuroCurrency = (value: number) => i18n.numberToCurrency(value,
  {
    delimiter: Localization.digitGroupingSeparator,
    separator: Localization.decimalSeparator,
    unit: '€',
  },
);
