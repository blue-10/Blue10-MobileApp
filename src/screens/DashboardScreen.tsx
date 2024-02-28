import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useCallback, useMemo } from 'react';
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
import type { RootStackParamList } from '../navigation/types';
import { useImageStore } from '../store/ImageStore';
import { colors, dimensions, text } from '../theme/';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const {
    currentUser,
    query: { isLoading },
  } = useGetCurrentUser();
  const currentCustomer = useGetCurrentCustomer();
  const { count: invoices, isLoading: isCountLoading } = useGetToDoInvoiceCount();
  const { reset: resetScannedImages } = useImageStore();
  const { t } = useTranslation();

  const onSwitchEnv = () => {
    navigation.navigate('SwitchEnvironment');
  };

  const onToDoInvoices = () => {
    navigation.navigate('InvoicesToDoScreen', {
      invoices: Number(invoices),
    });
  };

  const canUserUpload = useMemo(
    () =>
      currentUser?.MayValidateAllCompanies === true ||
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
      <LoaderWrapper height={text.largeTitle.lineHeight} isLoading={isLoading} mb={10} width={300}>
        <Text spaceAfter={10} variant="largeTitle">
          {t('dashboard.welcome_title', { name: currentUser?.Name ?? '' })}
        </Text>
      </LoaderWrapper>
      <LoaderWrapper height={text.caption1Regular.lineHeight} isLoading={isLoading} mb={10} width={190}>
        <Text spaceAfter={10} variant="caption1Regular">
          {t('dashboard.welcome_description', {
            environment: currentCustomer.customerName ?? '',
          })}
        </Text>
      </LoaderWrapper>
      <View style={styles.dashboardItemsContainer}>
        {canUserUpload && (
          <DashboardItem
            color={colors.dashboard.scan.background}
            isLoading={false}
            textColor={colors.dashboard.scan.text}
            title={t('scan.screen_title')}
            onPress={startScannerFlow}
          >
            <SvgCameraShape color={colors.white} height={75} style={{ alignSelf: 'center' }} width={75} />
          </DashboardItem>
        )}
        <DashboardItem
          color={colors.dashboard.toDo.background}
          contentTitle={invoices.toString()}
          isLoading={isCountLoading}
          textColor={colors.dashboard.toDo.text}
          title={t('to_do_invoices.screen_title')}
          onPress={onToDoInvoices}
        />
        {currentUser?.IsInMultipleEnvironments && (
          <DashboardItem
            color={colors.dashboard.switchEnv.background}
            isLoading={false}
            title={t('switch_environments.screen_title')}
            onPress={onSwitchEnv}
          >
            <SvgSwitchIcon style={{ alignSelf: 'center' }} />
          </DashboardItem>
        )}
        <DashboardItem
          color={colors.dashboard.switchEnv.background}
          isLoading={false}
          title={t('settings.screen_title')}
          onPress={() => navigation.navigate('Settings')}
        >
          <SvgGearShape color={colors.white} height={75} style={{ alignSelf: 'center' }} width={75} />
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
