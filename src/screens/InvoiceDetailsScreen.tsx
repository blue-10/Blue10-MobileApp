import type { StackScreenProps } from '@react-navigation/stack';
import { format } from 'date-fns';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { useInvoiceSearchQuery } from '@/hooks/queries/useInvoiceSearchQuery';
import { useNavigateToInvoice } from '@/hooks/useNavigateToInvoice';
import { useSearchFilterStore } from '@/store/SearchFilterStore';

import Box from '../components/Box/Box';
import Button from '../components/Button/Button';
import { InvoiceActionForm } from '../components/InvoiceActionForm/InvoiceActionForm';
import { useInvoiceActionFormSubmit } from '../components/InvoiceActionForm/InvoiceActionFormSubmit';
import { InvoiceDetailsNavigation } from '../components/InvoiceDetailsNavigation/InvoiceDetailsNavigation';
import { InvoiceLabelValue } from '../components/InvoiceLabelValue/InvoiceLabelValue';
import LoaderWrapper from '../components/LoaderWrapper/LoaderWrapper';
import Text from '../components/Text/Text';
import { useInvoiceDetails } from '../hooks/queries/useInvoiceDetails';
import { useStatusIdToText } from '../hooks/useStatusIdToText';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { numberToCurrency } from '../utils/numberToCurrency';

export type InvoiceDetailsScreenProps = StackScreenProps<RootStackParamList, 'InvoiceDetailsScreen'>;

const itemsMarginX = 26;
const borderColor = colors.borderColor;

export const InvoiceDetailsScreen: React.FC<InvoiceDetailsScreenProps> = ({ navigation, route }) => {
  const isIOS = Platform.OS === 'ios';
  const statusIdToText = useStatusIdToText();
  const [didUsedPullToRefresh, setDidUsedPullToRefresh] = useState(false);

  const { t } = useTranslation();
  const invoiceId = useMemo(() => route.params.id, [route.params.id]);
  const { data: item, isFetching, isLoading, refetch, isSuccess } = useInvoiceDetails(invoiceId);
  const {
    submit: actionFormSubmit,
    isSubmitDisabled: isActionButtonDisabled,
    isMutating: isActionMutating,
  } = useInvoiceActionFormSubmit(invoiceId);
  const navigateToInvoice = useNavigateToInvoice();

  useEffect(() => {
    setDidUsedPullToRefresh(false);
  }, [isSuccess]);

  const lastFilter = useSearchFilterStore((store) => store.lastFilter);

  const { getNextInvoice } = useInvoiceSearchQuery({ doNotSetLastFilter: true, filters: lastFilter ?? new Map() });

  const onSuccessActionHandle = useCallback(
    (nextInvoiceId: string | undefined) => {
      if (nextInvoiceId) {
        navigateToInvoice(nextInvoiceId);
        return;
      }
      // return to To-Do list or search results screen if there are no next invoices.
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
    [navigateToInvoice, navigation],
  );

  const onActionButtonPressed = useCallback(async () => {
    // we get the next invoice first before submitting.
    // because the query state can be reset when the action is submited.
    const nextInvoice = getNextInvoice(invoiceId);
    await actionFormSubmit({ onSuccess: () => onSuccessActionHandle(nextInvoice?.id) });
  }, [actionFormSubmit, getNextInvoice, invoiceId, onSuccessActionHandle]);

  const tableColor = colors.labelLightSecondary;
  const isButtonsDisabled = isFetching;

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        colors={[colors.primary]} // android
        refreshing={isFetching && didUsedPullToRefresh}
        tintColor={colors.primary} // ios
        onRefresh={() => {
          setDidUsedPullToRefresh(true);
          refetch();
        }}
      />
    ),
    [isFetching, refetch, didUsedPullToRefresh],
  );

  return (
    <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={stylesheet.container}>
      <InvoiceDetailsNavigation currentInvoiceId={invoiceId} isDisabled={isButtonsDisabled} />
      <ScrollView refreshControl={refreshControl} style={stylesheet.scrollContainer}>
        <Box borderBottom={1} borderColor={borderColor} mx={itemsMarginX} style={stylesheet.itemsFlexRow}>
          <Box borderColor={borderColor} borderRight={1} px={4} py={8} style={stylesheet.itemFlex2}>
            <InvoiceLabelValue
              isLabelLoading={isLoading}
              isValueLoading={isLoading}
              label={item?.companyName}
              labelEllipsizeMode="tail"
              labelLoadingWidth={150}
              labelNumberOfLines={1}
              value={item?.invoiceName}
              valueEllipsizeMode="tail"
              valueLoadingWidth={175}
              valueNumberOfLines={1}
            />
          </Box>
          <Box px={14} py={8} style={stylesheet.itemFlex1}>
            <InvoiceLabelValue
              valueAdjustsFontSizeToFit
              isValueLoading={isLoading}
              label={t('invoice_details.status')}
              value={item?.statusId ? statusIdToText(item.statusId) : '-'}
            />
          </Box>
        </Box>

        <Box borderBottom={1} borderColor={borderColor} mx={itemsMarginX} style={stylesheet.itemsFlexRow}>
          <Box borderColor={borderColor} borderRight={1} px={4} py={8} style={stylesheet.itemFlex1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              label={t('invoice_details.invoice_date')}
              value={item?.invoiceDate ? format(item.invoiceDate, 'dd MM yy') : '-'}
            />
          </Box>
          <Box borderColor={borderColor} borderRight={1} px={14} py={8} style={stylesheet.itemFlex1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              label={t('invoice_details.expiration_date')}
              value={item?.expirationDate ? format(item.expirationDate, 'dd MM yy') : '-'}
            />
          </Box>
          <Box px={14} py={8} style={stylesheet.itemFlex1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              label={t('invoice_details.payment_date')}
              value={item?.paymentDate ? format(item.paymentDate, 'dd MM yy') : '-'}
            />
          </Box>
        </Box>

        <Box borderBottom={1} borderColor={borderColor} mx={itemsMarginX} style={stylesheet.itemsFlexRow}>
          <Box borderColor={borderColor} borderRight={1} px={4} py={8} style={stylesheet.itemFlex1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              label={t('invoice_details.invoice_number')}
              value={item?.invoiceNumber ?? '-'}
            />
          </Box>
          <Box borderColor={borderColor} borderRight={1} px={14} py={8} style={stylesheet.itemFlex1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              label={t('invoice_details.entry_number')}
              value={item?.entryNumber ?? '-'}
            />
          </Box>
          <Box px={14} py={8} style={stylesheet.itemFlex1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              label={t('invoice_details.payment_condition')}
              value={item?.paymentCondition ?? '-'}
            />
          </Box>
        </Box>
        <Box borderBottom={1} borderColor={borderColor} mx={itemsMarginX}>
          <Box pb={4} pt={8} style={stylesheet.itemsFlexRow}>
            <Text color={tableColor} style={stylesheet.itemFlex1} variant="caption1Regular">
              {t('invoice_details.sub_total')}
            </Text>
            <LoaderWrapper heightOfTextStyle="bodyRegular" isLoading={isLoading} width={175}>
              <Text align="right" color={tableColor} style={stylesheet.itemFlex1} variant="bodyRegular">
                {item?.subtotal ? numberToCurrency(item.subtotal, item.currency) : '-'}
              </Text>
            </LoaderWrapper>
          </Box>
          <Box pb={8} pt={4} style={stylesheet.itemsFlexRow}>
            <Text color={tableColor} style={stylesheet.itemFlex1} variant="caption1Regular">
              {t('invoice_details.vat_total')}
            </Text>
            <LoaderWrapper heightOfTextStyle="bodyRegular" isLoading={isLoading} width={175}>
              <Text align="right" color={tableColor} style={stylesheet.itemFlex1} variant="bodyRegular">
                {item?.vatTotal ? numberToCurrency(item.vatTotal, item.currency) : '-'}
              </Text>
            </LoaderWrapper>
          </Box>
        </Box>

        <Box borderBottom={1} borderColor={borderColor} mx={itemsMarginX} py={18}>
          <Box style={stylesheet.itemsFlexRow}>
            <Text style={stylesheet.itemFlex1}>{t('invoice_details.total_to_pay')}</Text>
            <LoaderWrapper heightOfTextStyle="bodyRegularBold" isLoading={isLoading} width={175}>
              <Text align="right" style={stylesheet.itemFlex1} variant="bodyRegularBold">
                {item?.totalToPay ? numberToCurrency(item.totalToPay, item.currency) : '-'}
              </Text>
            </LoaderWrapper>
          </Box>
          <Box pt={20} style={stylesheet.buttonPlacement}>
            <Button
              isDisabled={isButtonsDisabled}
              size="S"
              title={t('invoice_details.button_originals')}
              variant="grey"
              onPress={() => navigation.navigate('InvoiceOriginalsScreen', { id: invoiceId })}
            />
            <Button
              isDisabled={isButtonsDisabled}
              size="S"
              style={{
                marginHorizontal: 24,
              }}
              title={t('invoice_details.button_bookings')}
              variant="grey"
              onPress={() => navigation.navigate('InvoiceBookingsScreen', { id: invoiceId })}
            />
            <Button
              isDisabled={isButtonsDisabled}
              size="S"
              title={t('invoice_details.button_timeline')}
              variant="grey"
              onPress={() => navigation.navigate('InvoiceTimelineScreen', { id: invoiceId })}
            />
          </Box>
        </Box>
        <Box py={18}>
          <InvoiceActionForm invoiceId={invoiceId} />
        </Box>
      </ScrollView>
      <Box borderColor={colors.borderColor} borderTop={1} px={26} py={32}>
        <Button
          isDisabled={isButtonsDisabled || isActionButtonDisabled}
          isLoading={isActionMutating}
          size="M"
          title={t('invoice_details.button_execute')}
          variant="primary"
          onPress={() => onActionButtonPressed()}
        />
      </Box>
    </KeyboardAvoidingView>
  );
};

const stylesheet = StyleSheet.create({
  buttonPlacement: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  flexAlignRight: {
    alignItems: 'flex-end',
  },
  itemFlex1: {
    flex: 1,
  },
  itemFlex2: {
    flex: 2.325,
  },
  itemsFlexRow: {
    flexDirection: 'row',
  },
  scrollContainer: {
    flex: 1,
  },
});
