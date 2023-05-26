/* eslint-disable max-len */
import { TranslationKeysType } from './types';

export const nl: TranslationKeysType = {
  dashboard: {
    log_off: 'Uitloggen',
    title: 'Dashboard',
    welcome_description: 'Je bent ingelogd op: {{environment}}',
    welcome_title: 'Hoi {{name}}',
  },
  error_view: {
    description: 'Er is een fout opgetreden in de applicatie die niet hersteld kan worden. Blijft dit probleem zich voortdoen? Gebruik dan de uitloggen knop hieronder.',
    logout_button: 'Uitloggen',
    reload_button: 'Applicatie herstarten',
    title: 'Er ging iets fout.',
  },
  fetch_error_message: {
    button_retry: 'Opnieuw proberen',
    description: 'Er ging iets nog goed bij het ophalen van gegevens. Probeer het nogmaals.',
    title: 'Er ging iets niet goed!',
  },
  general: {
    button_ok: 'OK',
    error: 'Fout',
  },
  invoice_action_form: {
    action_completed_title: 'Actie voltooid',
    button_action_help_text: 'Actie',
    button_user_help_text: 'Gebruiker',
    comment: 'Opmerking',
    no_action_selected: '(Geen actie geselecteerd)',
    no_user_selected: '(Geen gebruiker geselecteerd)',
    title: 'Acties',
  },
  invoice_action_select: {
    title: 'Acties',
  },
  invoice_booking_item: {
    bruto: 'Bruto:',
    netto: 'Netto:',
  },
  invoice_bookings: {
    file_size: 'Grote: {{size}}',
    title: 'Boekingen',
  },
  invoice_details: {
    button_bookings: 'Boekingen',
    button_execute: 'Uitvoeren',
    button_originals: 'Originelen',
    button_timeline: 'Tijdlijn',
    entry_number: 'Boekstuknr',
    expiration_date: 'Vervaldatum',
    invoice_date: 'Factuurdatum',
    invoice_number: 'Factuurnr',
    next_button: 'Volgende',
    payment_condition: 'Conditie',
    payment_date: 'Betaaldatum',
    previous_button: 'Vorige',
    status: 'Status',
    sub_total: 'Kosten',
    title: 'Factuur',
    total_to_pay: 'Te betalen',
    vat_total: 'BTW',
  },
  invoice_originals: {
    file_size: 'Grote: {{size}}',
    tab_attachments: 'Bijlagen',
    tab_invoice: 'Factuur',
    tab_packing_slips: 'Pakbonnen',
    title: 'Originelen',
  },
  invoice_timeline: {
    file_size: 'Grote: {{size}}',
    title: 'Tijdlijn',
  },
  invoice_timeline_item: {
    action: 'Actie',
    date: 'Datum',
  },
  invoice_user_select: {
    title: 'Gebruiker',
  },
  languages: {
    en: 'Engels',
    nl: 'Nederlands',
  },
  list_header: {
    last_updated_at: 'Voor het laatst bijgewerkt',
  },
  login: {
    email: 'E-mail',
    login: 'Login',
    password: 'Password',
    welcome_description: 'Login en ga direct aan de slag',
    welcome_title: 'Hoi',
  },
  login_site: {
    loading: 'Bezig met laden...',
  },
  login_site_error: {
    retry_button: 'Probeer opnieuw',
    title: 'Er ging iets fout.',
  },
  logout_confirm: {
    cancel_button: 'Nee',
    confirm_button: 'Ja, Uitloggen',
    message: 'Weet je zeker dat je wilt uitloggen?',
    title: 'Uitloggen',
  },
  scan: {
    camera_title: '',
    preview_menu_black_white_off: 'Zwart/wit modus uit',
    preview_menu_black_white_on: 'Zwart/wit modus',
    preview_menu_cancel: 'Annuleren',
    preview_menu_dashboard: 'Dashboard',
    preview_menu_document_recognition_off: 'Document herkenning uit',
    preview_menu_document_recognition_on: 'Document herkenning',
    preview_menu_title: 'Instellingen',
    preview_title: 'BLUE10 SCAN',
    preview_upload_failed_title: 'UPLOAD MISLUKT!',
    preview_upload_success_title: 'UPLOAD GELUKT!',
    screen_title: 'Scannen',
  },
  settings: {
    language_subtitle: 'Taal',
    logout: 'Uitloggen',
    screen_title: 'Voorkeuren',
  },
  switch_environments: {
    screen_title: 'Wissel omgeving',
  },
  to_approved_invoices: {
    count_results_header_one: '1 resultaat',
    count_results_header_other: '{{count}} resultaten',
    count_results_header_zero: '0 resultaten',
    screen_title: 'Goedkeuren',
  },
};
