import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import SvgSwitchIcon from '../../assets/icons/dashboard-switch-icon.svg';
import SvgGearShape from '../../assets/icons/gearshape.svg';
import { getTotalInvoices } from '../api/api';
import { DashboardItem } from '../components/DashboardItem/DashboardItem';
import IconButton from '../components/IconButton/IconButton';
import { ScreenWithStatusBarAndHeader } from '../components/ScreenWithStatusBarAndHeader';
import { queryKeys, queryRefetchInterval } from '../constants';
import i18n, { translationKeys } from '../i18n/i18n';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/AuthStore';
import { app, colors, dimensions } from '../theme/';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user, token, environmentId } = useAuthStore(({
    user,
    token,
    environmentId,
  }) => ({
    environmentId,
    token,
    user,
  }));
  const { userId } = user ?? {};

  // region react query
  const fnTotalInvoices = useCallback(
    () => getTotalInvoices(token ?? 'xxx', environmentId ?? 'xxx'),
    [token, environmentId],
  );

  const {
    isLoading,
    error,
    data: invoices,
  } = useQuery(
    [queryKeys.totalInvoices, userId, environmentId],
    fnTotalInvoices,
    {
      refetchInterval: queryRefetchInterval.totalInvoices,
    },
  );

  if (error) {
    // todo create a error screen or state.

    // eslint-disable-next-line no-console
    console.error(error);
  }
  // endregion

  const onSwitchEnv = () => {
    navigation.navigate('SwitchEnvironment');
  };

  const onApproveInvoices = () => {
    navigation.navigate(
      'InvoicesToApproveScreen',
      {
        invoices: Number(invoices),
      },
    );
  };

  return (
    <ScreenWithStatusBarAndHeader
      headerElement={(
        <IconButton
          color={colors.white}
          onPress={() => navigation.navigate('Settings')}
          icon={SvgGearShape}
        />
      )}
    >
      <>
        <Text style={app.headerText}>
          {i18n.translate(translationKeys.dashboard.welcome_title, { name: user?.name ?? '' })}
        </Text>
        <Text style={app.subTitleText}>
          {i18n.translate(
            translationKeys.dashboard.welcome_description,
            { environment: user?.environmentName ?? '' },
          )}
        </Text>

        <View style={styles.dashboardItemsContainer}>
          <DashboardItem
            isLoading={false}
            title={i18n.translate(translationKeys.switch_environments.screen_title)}
            color={colors.dashboard.switchEnv.background}
            onPress={onSwitchEnv}
          >
            <SvgSwitchIcon style={{ alignSelf: 'center' }} />
          </DashboardItem>
          <DashboardItem
            isLoading={isLoading}
            title={i18n.translate(translationKeys.to_approved_invoices.screen_title)}
            color={colors.dashboard.approval.background}
            textColor={colors.dashboard.approval.text}
            contentTitle={invoices ? invoices.toString() : ''}
            onPress={onApproveInvoices}
          />
        </View>
      </>
    </ScreenWithStatusBarAndHeader>
  );
};

const styles = StyleSheet.create({
  dashboardItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: dimensions.spacing.normal,
  },
});
