import { useActionSheet } from '@expo/react-native-action-sheet';
import type { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';

import { useSettingsStore } from '@/store/SettingsStore';

import { ScanPreview } from '../components/ScanPreview/ScanPreview';
import { useGetCurrentCustomer } from '../hooks/queries/useGetCurrentCustomer';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';
import { useCameraScan } from '../hooks/useCameraScan';
import { useUploadScanProcess } from '../hooks/useUploadScanProcess';
import type { RootStackParamList } from '../navigation/types';
import { useImageStore } from '../store/ImageStore';
import { useUploadStore } from '../store/UploadStore';
import { colors, dimensions } from '../theme/';
import { captureError } from '../utils/sentry';
import { ScanUploadModalScreen } from './ScanUploadModalScreen';

type Props = StackScreenProps<RootStackParamList, 'ScanPreviewScreen'>;

export const ScanPreviewScreen: React.FC<Props> = ({ navigation }) => {
  const settings = useSettingsStore((state) => state.settings);
  const setSetting = useSettingsStore((state) => state.setSetting);

  const { showActionSheetWithOptions } = useActionSheet();
  const currentCustomer = useGetCurrentCustomer();
  const { currentUser } = useGetCurrentUser();
  const { company, deleteImage, documentType, images, reset, selectedImageIndex, selectImage } = useImageStore();
  const { startUploadProcess, abortUploadProcess, shouldAbort } = useUploadScanProcess();
  const resetUploadStore = useUploadStore((state) => state.reset);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isCameraOpenedAtMount, setIsCameraOpenedAtMount] = useState<boolean>(false);
  const { hasPendingImages, setHasPendingImages, openCamera } = useCameraScan({
    onEmptyResults: () => {
      navigation.navigate('Dashboard');
    },
  });
  const { t } = useTranslation();

  useEffect(() => {
    if (company === undefined) {
      navigation.navigate('ScanSelectCompanyScreen');
    } else if (documentType === undefined) {
      navigation.navigate('ScanSelectDocumentTypeScreen');
    }
  }, [company, documentType, navigation]);

  const isUploadEnabled = useMemo(() => images.length > 0, [images]);

  useEffect(() => {
    if (!isCameraOpenedAtMount && !hasPendingImages && images.length === 0) {
      setIsCameraOpenedAtMount(true);
      openCamera()
        .then(() => {
          setIsCameraOpenedAtMount(false);
        })
        .catch((reason) => {
          captureError(reason, 'An error occurred while scanning documents');
        });
    }
  }, [images, hasPendingImages, openCamera, isCameraOpenedAtMount]);

  const toDashboard = useCallback(() => {
    reset();
    navigation.navigate('Dashboard');
  }, [navigation, reset]);

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('ScanSelectCompanyScreen');
    }
  }, [navigation]);

  const showActionSheet = useCallback(() => {
    const options = [
      t('scan.menu_select_company'),
      t('scan.menu_select_document_type'),
      t('scan.menu_dashboard'),
      t('scan.menu_cancel'),
    ];

    showActionSheetWithOptions(
      {
        cancelButtonIndex: options.length - 1,
        message:
          `${currentUser?.Name} - ${currentCustomer.customerName}\r\n` +
          `${company?.DisplayName} - ${t(`scan.document_type_${documentType?.key}`)}`,
        options,
        showSeparators: true,
        title: t('scan.menu_title') || undefined,
        titleTextStyle: {
          fontWeight: 'bold',
        },
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            navigation.navigate('ScanSelectCompanyScreen');
            break;

          case 1:
            navigation.navigate('ScanSelectDocumentTypeScreen');
            break;

          case 2:
            toDashboard();
            break;
        }
      },
    );
  }, [company, currentCustomer, currentUser, documentType, showActionSheetWithOptions, navigation, t, toDashboard]);

  const startUpload = useCallback(() => {
    setIsUploadModalOpen(true);
    startUploadProcess();
  }, [startUploadProcess]);

  const beforeStartUpload = useCallback(() => {
    const confirmHandle = (saveToCameraRoll: boolean) => {
      setSetting('hasAskedForSavingToCameraRoll', true);
      setSetting('saveToCameraRoll', saveToCameraRoll);
      startUpload();
    };

    if (!settings.hasAskedForSavingToCameraRoll) {
      Alert.alert(t('save_to_cameraroll_confirm.title'), t('save_to_cameraroll_confirm.description'), [
        {
          onPress: () => confirmHandle(true),
          text: t('save_to_cameraroll_confirm.yes'),
        },
        {
          onPress: () => confirmHandle(false),
          text: t('save_to_cameraroll_confirm.no'),
        },
      ]);
    } else {
      startUpload();
    }
  }, [setSetting, settings.hasAskedForSavingToCameraRoll, startUpload, t]);

  const finishUpload = useCallback(
    (uploadSuccessful: boolean) => {
      setIsUploadModalOpen(false);
      resetUploadStore();

      if (uploadSuccessful) {
        setHasPendingImages(true);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      }
    },
    [resetUploadStore, setHasPendingImages, toDashboard],
  );

  return (
    <View style={styles.screenContainer}>
      <StatusBar style="light" />
      <ScanUploadModalScreen
        isOpen={isUploadModalOpen}
        shouldAbort={shouldAbort()}
        tableListItems={[
          {
            label: t('scan.upload_table_user'),
            value: currentUser?.Name || t('general.unknown'),
          },
          {
            label: t('scan.upload_table_customer'),
            value: currentCustomer.customerName || t('general.unknown'),
          },
          {
            label: t('scan.upload_table_company'),
            value: company?.DisplayName || t('general.unknown'),
          },
          {
            label: t('scan.upload_table_document_type'),
            value: t(`scan.document_type_${documentType?.key}`),
          },
          {
            label: t('scan.upload_table_images'),
            value: `${images.length}`,
          },
        ]}
        onClose={finishUpload}
        onUploadAbort={abortUploadProcess}
        onUploadStart={startUploadProcess}
      />
      <ScanPreview
        hasPendingImages={hasPendingImages}
        images={images}
        isUploadEnabled={isUploadEnabled}
        selectedImageIndex={selectedImageIndex}
        title={t('scan.preview_title')}
        onDeleteCurrentImage={deleteImage}
        onEllipsesClick={showActionSheet}
        onGoBack={goBack}
        onOpenCamera={openCamera}
        onSelectImage={selectImage}
        onStartUpload={beforeStartUpload}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonBar: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 75,
    justifyContent: 'space-evenly',
    width: '100%',
  },
  buttonBarContainer: {
    alignItems: 'flex-start',
    height: 145,
    justifyContent: 'flex-start',
  },
  dashboardItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: dimensions.spacing.normal,
  },
  footerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: colors.white,
    height: 90,
    justifyContent: 'flex-end',
  },
  previewImage: {
    borderColor: colors.white,
    borderRadius: 3,
    borderWidth: 1,
    height: 49,
    marginStart: 16,
    width: 49,
  },
  previewImageLoader: {
    height: 49,
    marginStart: 16,
    width: 49,
  },
  previewImageSelected: {
    borderColor: 'yellow',
    borderRadius: 3,
    borderWidth: 3,
    height: 49,
    marginStart: 16,
    width: 49,
  },
  previewsBar: {
    alignItems: 'center',
    color: colors.white,
    flexDirection: 'row',
    height: 95,
    justifyContent: 'flex-start',
    paddingEnd: 16,
  },
  screenContainer: {
    backgroundColor: colors.white,
    color: colors.black,
    flex: 1,
  },
});
