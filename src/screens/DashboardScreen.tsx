import type { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, PermissionsAndroid, Platform, ScrollView, StyleSheet, View } from 'react-native';

import SvgCameraShape from '../../assets/icons/camerashape.svg';
import SvgSwitchIcon from '../../assets/icons/dashboard-switch-icon.svg';
import SvgGearShape from '../../assets/icons/gearshape.svg';
import SvgHistory from '../../assets/icons/history.svg';
import SvgMagnifyingGlass from '../../assets/icons/magnifyingglass.svg';
import { DashboardItem } from '../components/DashboardItem/DashboardItem';
import LoaderWrapper from '../components/LoaderWrapper/LoaderWrapper';
import { ScreenWithStatusBarAndHeader } from '../components/ScreenWithStatusBarAndHeader';
import Text from '../components/Text/Text';
import { useGetCurrentCustomer } from '../hooks/queries/useGetCurrentCustomer';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';
import { useGetToDoInvoiceCount } from '../hooks/queries/useGetToDoInvoicesCount';
import { useIsScrollable } from '../hooks/useIsScrollable';
import type { RootStackParamList } from '../navigation/types';
import { useImageStore } from '../store/ImageStore';
import { colors, dimensions, text } from '../theme/';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import PopUp from '@/components/PopUp/PopUp';
import RNFS from 'react-native-fs';

type Props = StackScreenProps<RootStackParamList, 'Dashboard'>;

const GRID_GAP = 20;

export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;

  if (Platform.Version >= 30) {
    // Android 11+
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, {
      title: 'Storage Permission Required',
      message: 'App needs access to your storage to receive shared files',
      buttonPositive: 'OK',
    });

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Linking.openSettings();
      return false;
    }
  } else {
    // Android < 11
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
      title: 'Storage Permission Required',
      message: 'App needs access to your storage to receive shared files',
      buttonPositive: 'OK',
    });

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
};

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const {
    currentUser,
    query: { isLoading },
  } = useGetCurrentUser();
  const currentCustomer = useGetCurrentCustomer();
  const { count: invoices, isLoading: isCountLoading } = useGetToDoInvoiceCount();
  const { reset: resetScannedImages } = useImageStore();
  const { t } = useTranslation();
  const [itemWidth, setItemWidth] = useState<number | undefined>();
  const { isScrollable, onContenteSizeChange, onLayout } = useIsScrollable();

  const calcItemWidth = useCallback((viewWidth: number) => {
    setItemWidth((viewWidth - GRID_GAP) / 2);
  }, []);

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

  const [sharedFiles, setSharedFiles] = useState<string[]>([]);
  const [hasReadSharedJSON, setHasReadSharedJSON] = useState(false);

  const saveFilesToDocuments = async (files: string[]) => {
    const saved: string[] = [];
    for (const file of files) {
      try {
        const fileName = file.split('/').pop();
        const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        await RNFS.copyFile(file, destPath);
        saved.push(destPath);
      } catch (err) {
        console.log('Cannot copy shared file:', err);
      }
    }
    return saved;
  };

  useEffect(() => {
    // Android: ReceiveSharingIntent
    if (Platform.OS === 'android') {
      ReceiveSharingIntent.getReceivedFiles(
        async (files: any[]) => {
          const paths = files.map((f: any) => f.filePath);
          const saved = await saveFilesToDocuments(paths);
          setSharedFiles(saved);
        },
        () => {},
        'Blue10ShareMedia',
      );

      return () => {
        ReceiveSharingIntent.clearReceivedFiles();
      };
    }

    // iOS: Linking URL from Share Extension
    const handleURL = async (event: { url: string }) => {
      if (!event.url || !event.url.includes('filePath=') || hasReadSharedJSON) return;

      setHasReadSharedJSON(true);
      const url = decodeURIComponent(event.url.split('filePath=')[1]);

      try {
        const contents = await RNFS.readFile(url, 'utf8');
        const files = JSON.parse(contents);

        const fullPaths = files.map((f: string) => url.replace('shared.json', f));
        const saved = await saveFilesToDocuments(fullPaths);
        setSharedFiles(saved);
      } catch (err) {
        console.log('Cannot read shared.json', err);
      }
    };

    Linking.addEventListener('url', handleURL);

    // اگر اپ با URL باز شد
    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) handleURL({ url: initialUrl });
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, [hasReadSharedJSON]);

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
      <ScrollView
        bounces={isScrollable}
        style={styles.dashboardScrollContainer}
        onContentSizeChange={onContenteSizeChange}
        onLayout={onLayout}
      >
        <View
          style={styles.dashboardItemsContainer}
          onLayout={(event) => {
            calcItemWidth(event.nativeEvent.layout.width);
          }}
        >
          {canUserUpload && (
            <DashboardItem
              buttonSize={itemWidth}
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
            buttonSize={itemWidth}
            color={colors.dashboard.toDo.background}
            contentTitle={invoices.toString()}
            isLoading={isCountLoading}
            textColor={colors.dashboard.toDo.text}
            title={t('to_do_invoices.screen_title')}
            onPress={onToDoInvoices}
          />
          {currentUser?.IsInMultipleEnvironments && (
            <DashboardItem
              buttonSize={itemWidth}
              color={colors.dashboard.switchEnv.background}
              isLoading={false}
              title={t('switch_environments.screen_title')}
              onPress={onSwitchEnv}
            >
              <SvgSwitchIcon style={{ alignSelf: 'center' }} />
            </DashboardItem>
          )}
          <DashboardItem
            buttonSize={itemWidth}
            color={colors.dashboard.search.background}
            isLoading={false}
            title={t('search.screen_title')}
            onPress={() => navigation.navigate('SearchFiltersScreen')}
          >
            <SvgMagnifyingGlass color={colors.white} height={64} style={{ alignSelf: 'center' }} width={64} />
          </DashboardItem>
          <DashboardItem
            buttonSize={itemWidth}
            color={colors.dashboard.switchEnv.background}
            isLoading={false}
            title={t('settings.screen_title')}
            onPress={() => navigation.navigate('Settings')}
          >
            <SvgGearShape color={colors.white} height={75} style={{ alignSelf: 'center' }} width={75} />
          </DashboardItem>
          <DashboardItem
            buttonSize={itemWidth}
            color={colors.dashboard.history.background}
            isLoading={false}
            title={t('dashboard.history')}
            onPress={() => navigation.navigate('history')}
          >
            <SvgHistory color={colors.white} height={75} style={{ alignSelf: 'center' }} width={75} />
          </DashboardItem>
        </View>
      </ScrollView>

      {/* PopUp تصاویر share شده */}
      <PopUp images={sharedFiles} />
    </ScreenWithStatusBarAndHeader>
  );
};

const styles = StyleSheet.create({
  dashboardItemsContainer: {
    columnGap: GRID_GAP,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    rowGap: 10,
  },
  dashboardScrollContainer: {
    marginTop: dimensions.spacing.normal,
  },
});
