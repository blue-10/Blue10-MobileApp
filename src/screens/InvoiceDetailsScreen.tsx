import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet } from 'react-native';

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
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { numberToCurrency } from '../utils/numberToCurrency';

export type InvoiceDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'InvoiceDetailsScreen'>;

const itemsMarginX = 26;
const borderColor = colors.borderColor;

export const InvoiceDetailsScreen: React.FC<InvoiceDetailsScreenProps> = ({ navigation, route }) => {
  const isIOS = Platform.OS === 'ios';
  const statusIdToText = useStatusIdToText();

  const { t } = useTranslation();
  const invoiceId = useMemo(() => route.params.id, [route.params.id]);
  const { data: item, isFetching, isLoading, isInitialLoading, refetch } = useInvoiceDetails(invoiceId);
  const {
    submit: actionFormSubmit,
    isSubmitDisabled: isActionButtonDisabled,
    isMutating: isActionMutating,
  } = useInvoiceActionFormSubmit(invoiceId);

  const tableColor = colors.labelLightSecondary;
  const isButtonsDisabled = isFetching;

  return (
    <KeyboardAvoidingView
      style={stylesheet.container}
      behavior={isIOS ? 'padding' : 'height'}
    >
      <InvoiceDetailsNavigation
        isDisabled={isButtonsDisabled}
        currentInvoiceId={invoiceId}
      />
      <ScrollView
        style={stylesheet.scrollContainer}
        refreshControl={(
          <RefreshControl
            colors={[colors.primary]} // android
            tintColor={colors.primary} // ios
            refreshing={isFetching && !isInitialLoading}
            onRefresh={() => refetch()}
          />
        )}
      >
        <Box borderColor={borderColor} borderBottom={1} style={stylesheet.itemsFlexRow} mx={itemsMarginX}>
          <Box py={8} px={4} style={stylesheet.itemFlex2} borderColor={borderColor} borderRight={1}>
            <InvoiceLabelValue
              isLabelLoading={isLoading}
              label={item?.companyName}
              labelLoadingWidth={150}
              labelEllipsizeMode="tail"
              labelNumberOfLines={1}

              isValueLoading={isLoading}
              value={item?.invoiceName}
              valueEllipsizeMode="tail"
              valueLoadingWidth={175}
              valueNumberOfLines={1}
            />
          </Box>
          <Box py={8} px={14} style={stylesheet.itemFlex1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              label={t('invoice_details.status')}
              value={item?.statusId ? statusIdToText(item.statusId) : '-'}
              valueAdjustsFontSizeToFit
            />
          </Box>
        </Box>

        <Box borderColor={borderColor} borderBottom={1} style={stylesheet.itemsFlexRow} mx={itemsMarginX}>
          <Box py={8} px={4} style={stylesheet.itemFlex1} borderColor={borderColor} borderRight={1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              label={t('invoice_details.invoice_date')}
              value={item?.invoiceDate ? format(item.invoiceDate, 'dd MM yy') : '-'}
            />
          </Box>
          <Box py={8} px={14} style={stylesheet.itemFlex1} borderColor={borderColor} borderRight={1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              label={t('invoice_details.expiration_date')}
              value={item?.expirationDate ? format(item.expirationDate, 'dd MM yy') : '-'}
            />
          </Box>
          <Box py={8} px={14} style={stylesheet.itemFlex1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              label={t('invoice_details.payment_date')}
              value={item?.paymentDate ? format(item.paymentDate, 'dd MM yy') : '-'}
            />
          </Box>
        </Box>

        <Box borderColor={borderColor} borderBottom={1} style={stylesheet.itemsFlexRow} mx={itemsMarginX}>
          <Box py={8} px={4} style={stylesheet.itemFlex1} borderColor={borderColor} borderRight={1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              value={item?.invoiceNumber ?? '-'}
              label={t('invoice_details.invoice_number')}
            />
          </Box>
          <Box py={8} px={14} style={stylesheet.itemFlex1} borderColor={borderColor} borderRight={1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              value={item?.entryNumber ?? '-'}
              label={t('invoice_details.entry_number')}
            />
          </Box>
          <Box py={8} px={14} style={stylesheet.itemFlex1}>
            <InvoiceLabelValue
              isValueLoading={isLoading}
              value={item?.paymentCondition ?? '-'}
              label={t('invoice_details.payment_condition')}
            />
          </Box>
        </Box>
        <Box borderColor={borderColor} borderBottom={1} mx={itemsMarginX}>
          <Box style={stylesheet.itemsFlexRow} pt={8} pb={4}>
            <Text style={stylesheet.itemFlex1} color={tableColor} variant="caption1Regular">
              {t('invoice_details.sub_total')}
            </Text>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={175}>
              <Text style={stylesheet.itemFlex1} color={tableColor} align="right" variant="bodyRegular">
                {item?.subtotal ? numberToCurrency(item.subtotal, item.currency) : '-'}
              </Text>
            </LoaderWrapper>
          </Box>
          <Box style={stylesheet.itemsFlexRow} pt={4} pb={8}>
            <Text style={stylesheet.itemFlex1} color={tableColor} variant="caption1Regular">
              {t('invoice_details.vat_total')}
            </Text>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={175}>
              <Text style={stylesheet.itemFlex1} color={tableColor} align="right" variant="bodyRegular">
                {item?.vatTotal ? numberToCurrency(item.vatTotal, item.currency) : '-'}
              </Text>
            </LoaderWrapper>
          </Box>
        </Box>

        <Box borderColor={borderColor} borderBottom={1} mx={itemsMarginX} py={18}>
          <Box style={stylesheet.itemsFlexRow}>
            <Text style={stylesheet.itemFlex1}>{t('invoice_details.total_to_pay')}</Text>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegularBold" width={175}>
              <Text style={stylesheet.itemFlex1} align="right" variant="bodyRegularBold">
                {item?.totalToPay ? numberToCurrency(item.totalToPay, item.currency) : '-'}
              </Text>
            </LoaderWrapper>
          </Box>
          <Box style={stylesheet.buttonPlacement} pt={20}>
            <Button
              variant="grey"
              size="S"
              title={t('invoice_details.button_originals')}
              isDisabled={isButtonsDisabled}
              onPress={() => navigation.navigate('InvoiceOriginalsScreen', { id: invoiceId })}
            />
            <Button
              variant="grey"
              size="S"
              title={t('invoice_details.button_bookings')}
              onPress={() => navigation.navigate('InvoiceBookingsScreen', { id: invoiceId })}
              isDisabled={isButtonsDisabled}
              style={{
                marginHorizontal: 24,
              }}
            />
            <Button
              variant="grey"
              size="S"
              title={t('invoice_details.button_timeline')}
              isDisabled={isButtonsDisabled}
              onPress={() => navigation.navigate('InvoiceTimelineScreen', { id: invoiceId })}
            />
          </Box>
        </Box>
        <Box py={18}>
          <InvoiceActionForm invoiceId={invoiceId} />
        </Box>
      </ScrollView>
      <Box py={32} px={26} borderTop={1} borderColor="#E9E9EA">
        <Button
          size="M"
          variant="primary"
          title={t('invoice_details.button_execute')}
          isDisabled={isButtonsDisabled || isActionButtonDisabled}
          onPress={() => actionFormSubmit()}
          isLoading={isActionMutating}
        />
      </Box>
    </KeyboardAvoidingView>
  );
};

const stylesheet = StyleSheet.create(
  {
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
  },
);
