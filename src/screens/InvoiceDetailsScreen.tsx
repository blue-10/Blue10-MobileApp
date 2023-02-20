import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet } from 'react-native';

import ArrowLeftIcon from '../../assets/icons/arrow-round-left.svg';
import ArrowRightIcon from '../../assets/icons/arrow-round-right.svg';
import { getInvoiceDetails } from '../api/api';
import Box from '../components/Box/Box';
import Button from '../components/Button/Button';
import LoaderWrapper from '../components/LoaderWrapper/LoaderWrapper';
import Text from '../components/Text/Text';
import TextInput from '../components/TextInput/TextInput';
import { queryKeys } from '../constants';
import i18n, { t, translationKeys } from '../i18n/i18n';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/AuthStore';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceDetailsScreen'>;

const itemsMarginX = 26;
const borderColor = colors.borderColor;
const translate = translationKeys.invoice_details;

export const InvoiceDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { token, environmentId } = useAuthStore(({ token, environmentId }) => ({ environmentId, token }));
  const [comment, setComment] = useState<string>('Opnieuw ingediend');
  const invoiceId = useMemo(() => route.params.id, [route.params.id]);
  const isIOS = Platform.OS === 'ios';
  const tableColor = colors.labelLightSecondary;
  const {
    data: item,
    isLoading,
    isFetching,
    isInitialLoading,
    refetch,
  } = useQuery(
    [queryKeys.invoice, environmentId, invoiceId],
    () => getInvoiceDetails(token ?? 'xxx', environmentId ?? 'xxx', invoiceId),
  );

  const onPressTemp = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const isButtonsDisabled = isFetching;

  return (
    <KeyboardAvoidingView
      style={stylesheet.container}
      behavior={isIOS ? 'padding' : 'height'}
    >
      <Box borderColor={borderColor} borderBottom={1} style={stylesheet.itemsFlexRow} borderTop={isIOS ? 1 : 0}>
        <Box borderColor={borderColor} borderRight={1} px={12} style={stylesheet.itemFlex1}>
          <Button
            size="S"
            variant="greyClear"
            iconLeft={ArrowLeftIcon}
            // title={i18n.translate(translate.previousButton)}
            title={t('invoice_details.previous_button')}
            textAlign="left"
            isDisabled={isButtonsDisabled}
            onPress={onPressTemp}
          />
        </Box>
        <Box style={stylesheet.itemFlex1} px={12}>
          <Button
            size="S"
            variant="secondaryClear"
            iconRight={ArrowRightIcon}
            title={i18n.translate(translate.next_button)}
            textAlign="right"
            isDisabled={isButtonsDisabled}
            onPress={onPressTemp}
          />
        </Box>
      </Box>
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
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={175}>
              <Text variant="bodyRegular" color={tableColor} ellipsizeMode="tail" numberOfLines={1}>
                {item?.companyName}
              </Text>
            </LoaderWrapper>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="caption1Regular" width={150}>
              <Text variant="caption1Regular" color={tableColor} ellipsizeMode="tail" numberOfLines={1}>
                {item?.companySubTitle}
              </Text>
            </LoaderWrapper>
          </Box>
          <Box py={8} px={14} style={stylesheet.itemFlex1}>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={90}>
              <Text variant="bodyRegular" color={tableColor}>{item?.status}</Text>
            </LoaderWrapper>
            <Text variant="caption1Regular" color={tableColor}>{i18n.translate(translate.status)}</Text>
          </Box>
        </Box>

        <Box borderColor={borderColor} borderBottom={1} style={stylesheet.itemsFlexRow} mx={itemsMarginX}>
          <Box py={8} px={4} style={stylesheet.itemFlex1} borderColor={borderColor} borderRight={1}>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={90}>
              <Text variant="bodyRegular" color={tableColor}>{item?.invoiceDate}</Text>
            </LoaderWrapper>
            <Text variant="caption1Regular" color={tableColor}>{i18n.translate(translate.invoice_date)}</Text>
          </Box>
          <Box py={8} px={14} style={stylesheet.itemFlex1} borderColor={borderColor} borderRight={1}>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={90}>
              <Text variant="bodyRegular" color={tableColor}>{item?.expirationDate}</Text>
            </LoaderWrapper>
            <Text variant="caption1Regular" color={tableColor}>{i18n.translate(translate.expiration_date)}</Text>
          </Box>
          <Box py={8} px={14} style={stylesheet.itemFlex1}>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={90}>
              <Text variant="bodyRegular" color={tableColor}>{item?.paymentDate}</Text>
            </LoaderWrapper>
            <Text variant="caption1Regular" color={tableColor}>{i18n.translate(translate.payment_date)}</Text>
          </Box>
        </Box>

        <Box borderColor={borderColor} borderBottom={1} style={stylesheet.itemsFlexRow} mx={itemsMarginX}>
          <Box py={8} px={4} style={stylesheet.itemFlex1} borderColor={borderColor} borderRight={1}>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={90}>
              <Text variant="bodyRegular" color={tableColor}>{item?.invoiceNumber}</Text>
            </LoaderWrapper>
            <Text variant="caption1Regular" color={tableColor}>{i18n.translate(translate.invoice_number)}</Text>
          </Box>
          <Box py={8} px={14} style={stylesheet.itemFlex1} borderColor={borderColor} borderRight={1}>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={90}>
              <Text variant="bodyRegular" color={tableColor}>{item?.entryNumber}</Text>
            </LoaderWrapper>
            <Text variant="caption1Regular" color={tableColor}>{i18n.translate(translate.entry_number)}</Text>
          </Box>
          <Box py={8} px={14} style={stylesheet.itemFlex1}>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={90}>
              <Text variant="bodyRegular" color={tableColor}>{item?.paymentCondition}</Text>
            </LoaderWrapper>
            <Text variant="caption1Regular" color={tableColor}>{i18n.translate(translate.payment_condition)}</Text>
          </Box>
        </Box>
        <Box borderColor={borderColor} borderBottom={1} mx={itemsMarginX}>
          <Box style={stylesheet.itemsFlexRow} pt={8} pb={4}>
            <Text style={stylesheet.itemFlex1} color={tableColor} variant="caption1Regular">
              {i18n.translate(translate.sub_total)}
            </Text>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={175}>
              <Text style={stylesheet.itemFlex1} color={tableColor} align="right" variant="bodyRegular">
                {item?.subtotal}
              </Text>
            </LoaderWrapper>
          </Box>
          <Box style={stylesheet.itemsFlexRow} pt={4} pb={8}>
            <Text style={stylesheet.itemFlex1} color={tableColor} variant="caption1Regular">
              {i18n.translate(translate.vat_total)}
            </Text>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegular" width={175}>
              <Text style={stylesheet.itemFlex1} color={tableColor} align="right" variant="bodyRegular">
                {item?.vatTotal}
              </Text>
            </LoaderWrapper>
          </Box>
        </Box>

        <Box borderColor={borderColor} borderBottom={1} mx={itemsMarginX} py={18}>
          <Box style={stylesheet.itemsFlexRow}>
            <Text style={stylesheet.itemFlex1}>{i18n.translate(translate.total_to_pay)}</Text>
            <LoaderWrapper isLoading={isLoading} heightOfTextStyle="bodyRegularBold" width={175}>
              <Text style={stylesheet.itemFlex1} align="right" variant="bodyRegularBold">{item?.totalToPay}</Text>
            </LoaderWrapper>
          </Box>
          <Box style={stylesheet.buttonPlacement} pt={20}>
            <Button
              variant="grey"
              size="S"
              title={i18n.translate(translate.button_originals)}
              isDisabled={isButtonsDisabled}
              onPress={() => navigation.navigate('InvoiceOriginalsScreen', { id: invoiceId })}
            />
            <Button
              variant="grey"
              size="S"
              title={i18n.translate(translate.button_bookings)}
              onPress={() => navigation.navigate('InvoiceBookingsScreen', { id: invoiceId })}
              isDisabled={isButtonsDisabled}
              style={{
                marginHorizontal: 24,
              }}
            />
            <Button
              variant="grey"
              size="S"
              title={i18n.translate(translate.button_timeline)}
              isDisabled={isButtonsDisabled}
              onPress={() => navigation.navigate('InvoiceTimelineScreen', { id: invoiceId })}
            />
          </Box>
        </Box>
        <Box borderColor={borderColor} borderBottom={1} mx={itemsMarginX} py={18}>
          <Text variant="title">{i18n.translate(translate.actions_title)}</Text>
          <Box style={stylesheet.itemsFlexRow} pt={16}>
            <Box style={stylesheet.itemFlex1} pr={10}>
              <Button
                variant="secondary"
                size="S"
                title={i18n.translate(translate.button_send)}
                isDisabled={isButtonsDisabled}
                onPress={onPressTemp}
              />
              <Box py={4}>
                <Text align="center" color={tableColor}>{i18n.translate(translate.button_send_help_text)}</Text>
              </Box>
            </Box>
            <Box style={stylesheet.itemFlex1} pl={10}>
              <Button
                variant="secondary"
                size="S"
                title="Bart spruijt"
                isDisabled={isButtonsDisabled}
                onPress={() => navigation.navigate('InvoiceSelectUserScreen', { id: invoiceId })}
              />
              <Box py={4}>
                <Text align="center" color={tableColor}>{i18n.translate(translate.button_user_help_text)}</Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box mx={itemsMarginX} pb={16}>
          <TextInput
            value={comment}
            onChangeText={(value) => setComment(value)}
            label={i18n.translate(translate.comment)}
          />
        </Box>
      </ScrollView>
      <Box py={32} px={26} borderTop={1} borderColor="#E9E9EA">
        <Button
          size="M"
          variant="primary"
          title={i18n.translate(translate.button_execute)}
          isDisabled={isButtonsDisabled}
          onPress={onPressTemp}
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
