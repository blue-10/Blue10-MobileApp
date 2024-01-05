import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import SvgCameraShape from '../../assets/icons/camerashape.svg';
import SvgSwitchIcon from '../../assets/icons/dashboard-switch-icon.svg';
import SvgGearShape from '../../assets/icons/gearshape.svg';
import { DashboardItem } from '../components/DashboardItem/DashboardItem';
import LoaderWrapper from '../components/LoaderWrapper/LoaderWrapper';
import { ScreenWithStatusBarAndHeader } from '../components/ScreenWithStatusBarAndHeader';
import Text from '../components/Text/Text';
import { useGetCurrentCustomer } from '../hooks/queries/useGetCurrentCustomer';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';
import { useGetToDoInvoiceCount } from '../hooks/queries/useGetToDoInvoicesCount';
import { RootStackParamList } from '../navigation/types';
import { useImageStore } from '../store/ImageStore';
import { colors, dimensions, text } from '../theme/';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { currentUser, query: { isLoading } } = useGetCurrentUser();
  const currentCustomer = useGetCurrentCustomer();
  const { count: invoices, isLoading: isCountLoading } = useGetToDoInvoiceCount();
  const { reset: resetScannedImages } = useImageStore();
  const { t } = useTranslation();

  const onSwitchEnv = () => {
    navigation.navigate('SwitchEnvironment');
  };

  const onToDoInvoices = () => {
    navigation.navigate(
      'InvoicesToDoScreen',
      {
        invoices: Number(invoices),
      },
    );
  };

  const canUserUpload = useMemo(
    () => currentUser?.MayValidateAllCompanies === true ||
      currentUser?.MaySeeAllCompanies === true ||
      (currentUser?.ValidateCompanies || []).length > 0 ||
      (currentUser?.SeeCompanies || []).length > 0,
    [currentUser],
  );

  const startScannerFlow = useCallback(() => {
    resetScannedImages();
    navigation.navigate('ScanSelectCompanyScreen');
  }, [navigation, resetScannedImages]);

  return (
    <ScreenWithStatusBarAndHeader>
      <LoaderWrapper isLoading={isLoading} width={300} height={text.largeTitle.lineHeight} mb={10}>
        <Text variant="largeTitle" spaceAfter={10}>
          {t('dashboard.welcome_title', { name: currentUser?.Name ?? '' })}
        </Text>
      </LoaderWrapper>
      <LoaderWrapper isLoading={isLoading} width={190} height={text.caption1Regular.lineHeight} mb={10}>
        <Text variant="caption1Regular" spaceAfter={10}>
          {t('dashboard.welcome_description', { environment: currentCustomer.customerName ?? '' })}
        </Text>
      </LoaderWrapper>
      <View style={styles.dashboardItemsContainer}>
        {canUserUpload && (
          <DashboardItem
            isLoading={false}
            title={t('scan.screen_title')}
            color={colors.dashboard.scan.background}
            textColor={colors.dashboard.scan.text}
            onPress={startScannerFlow}
          >
            <SvgCameraShape color={colors.white} style={{ alignSelf: 'center' }} width={75} height={75} />
          </DashboardItem>
        )}
        <DashboardItem
          isLoading={isCountLoading}
          title={t('to_do_invoices.screen_title')}
          color={colors.dashboard.toDo.background}
          textColor={colors.dashboard.toDo.text}
          contentTitle={invoices.toString()}
          onPress={onToDoInvoices}
        />
        {currentUser?.IsInMultipleEnvironments && (
          <DashboardItem
            isLoading={false}
            title={t('switch_environments.screen_title')}
            color={colors.dashboard.switchEnv.background}
            onPress={onSwitchEnv}
          >
            <SvgSwitchIcon style={{ alignSelf: 'center' }} />
          </DashboardItem>
        )}
        <DashboardItem
          isLoading={false}
          title={t('settings.screen_title')}
          color={colors.dashboard.switchEnv.background}
          onPress={() => navigation.navigate('Settings')}
        >
          <SvgGearShape color={colors.white} style={{ alignSelf: 'center' }} width={75} height={75} />
        </DashboardItem>
      </View>
    </ScreenWithStatusBarAndHeader>
  );
};

const styles = StyleSheet.create({
  dashboardItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: dimensions.spacing.normal,
  },
});
