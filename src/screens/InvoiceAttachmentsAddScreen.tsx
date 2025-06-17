import type { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';

import { useSettingsStore } from '@/store/SettingsStore';

import { ScanPreview } from '../components/ScanPreview/ScanPreview';
import { useInvalidateInvoiceAttachments } from '../hooks/invalidate/useInvalidateInvoiceAttachments';
import { useGetCurrentCustomer } from '../hooks/queries/useGetCurrentCustomer';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';
import { useInvoiceDetails } from '../hooks/queries/useInvoiceDetails';
import { useCameraScan } from '../hooks/useCameraScan';
import { useUploadAttachmentProcess } from '../hooks/useUploadAttachmentProcess';
import type { RootStackParamList } from '../navigation/types';
import { useImageStore } from '../store/ImageStore';
import { useUploadStore } from '../store/UploadStore';
import { colors } from '../theme/';
import { captureError } from '../utils/sentry';
import { ScanUploadModalScreen } from './ScanUploadModalScreen';

type Props = StackScreenProps<RootStackParamList, 'InvoiceAttachmentAddScreen'>;

export const InvoiceAttachmentAddScreen: React.FC<Props> = ({ route, navigation }) => {
  const settings = useSettingsStore((state) => state.settings);
  const setSetting = useSettingsStore((state) => state.setSetting);

  const { t } = useTranslation();
  const currentCustomer = useGetCurrentCustomer();
  const invoiceId = useMemo(() => route.params.id, [route.params.id]);
  const { data: item } = useInvoiceDetails(invoiceId);
  const { currentUser } = useGetCurrentUser();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isCameraOpenedAtMount, setIsCameraOpenedAtMount] = useState<boolean>(false);
  const { deleteImage, images, reset, selectedImageIndex, selectImage } = useImageStore();
  const resetUploadStore = useUploadStore((state) => state.reset);
  const { hasPendingImages, setHasPendingImages, openCamera } = useCameraScan({
    onEmptyResults: () => {
      navigation.goBack();
    },
  });
  const { shouldAbort, abortUploadProcess, startUploadProcess } = useUploadAttachmentProcess();
  const invalidateAttachments = useInvalidateInvoiceAttachments();

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
  }, [images, hasPendingImages, openCamera, navigation, isCameraOpenedAtMount]);

  const startUploadProcessInvoice = useCallback(() => {
    startUploadProcess(invoiceId);
  }, [invoiceId, startUploadProcess]);

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      reset();
      navigation.goBack();
    }
  }, [navigation, reset]);

  const startUpload = useCallback(() => {
    setIsUploadModalOpen(true);
    startUploadProcessInvoice();
  }, [setIsUploadModalOpen, startUploadProcessInvoice]);

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
        invalidateAttachments(invoiceId);
        goBack();
      }
    },
    [goBack, invalidateAttachments, invoiceId, resetUploadStore, setHasPendingImages],
  );

  const isUploadEnabled = useMemo(() => images.length > 0, [images]);

  return (
    <View style={styles.screenContainer}>
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
            value: item?.companyName || t('general.unknown'),
          },
          {
            label: t('scan.upload_table_images'),
            value: `${images.length}`,
          },
        ]}
        onClose={finishUpload}
        onUploadAbort={abortUploadProcess}
        onUploadStart={startUploadProcessInvoice}
      />
      <ScanPreview
        hasPendingImages={false}
        images={images}
        isUploadEnabled={isUploadEnabled}
        selectedImageIndex={selectedImageIndex}
        title={t('scan.preview_title')}
        onDeleteCurrentImage={deleteImage}
        onGoBack={goBack}
        onOpenCamera={openCamera}
        onSelectImage={selectImage}
        onStartUpload={beforeStartUpload}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: colors.white,
    color: colors.black,
    flex: 1,
  },
});
