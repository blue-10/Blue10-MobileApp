import { useActionSheet } from '@expo/react-native-action-sheet';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentScanner, { ResponseType, ScanDocumentResponseStatus } from 'react-native-document-scanner-plugin';

import SvgArrowLeftIcon from '../../assets/icons/arrow-round-left.svg';
import SvgEllipsisIcon from '../../assets/icons/ellipsis-icon.svg';
import SvgPlusIcon from '../../assets/icons/plus-icon.svg';
import SvgTrashIcon from '../../assets/icons/trash-icon.svg';
import SvgUploadIcon from '../../assets/icons/upload-icon.svg';
import Text from '../components/Text/Text';
import { useGetCurrentCustomer } from '../hooks/queries/useGetCurrentCustomer';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';
import { useUploadProcess } from '../hooks/useUploadProcess';
import type { RootStackParamList } from '../navigation/types';
import { useImageStore } from '../store/ImageStore';
import { colors, dimensions } from '../theme/';
import { rotateImageIfNeeded } from '../utils/imageUtils';
import { captureError } from '../utils/sentry';
import { ScanUploadModalScreen } from './ScanUploadModalScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanPreviewScreen'>;

export const ScanPreviewScreen: React.FC<Props> = ({ navigation }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const currentCustomer = useGetCurrentCustomer();
  const { currentUser } = useGetCurrentUser();
  const { addImages, company, deleteImage, documentType, images, reset, selectedImageIndex, selectImage } =
    useImageStore();
  const { startUploadProcess } = useUploadProcess();
  const [hasPendingImages, setHasPendingImages] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (company === undefined) {
      navigation.navigate('ScanSelectCompanyScreen');
    } else if (documentType === undefined) {
      navigation.navigate('ScanSelectDocumentTypeScreen');
    }
  }, [company, documentType, navigation]);

  const isUploadEnabled = useMemo(() => images.length > 0, [images]);

  const openCamera = useCallback(async () => {
    try {
      const result = await DocumentScanner.scanDocument({
        croppedImageQuality: 100,
        letUserAdjustCrop: true,
        responseType: ResponseType.ImageFilePath,
      });

      setHasPendingImages(true);
      const rotatedImagePaths: string[] = [];

      // if the status is not Success, the user cancelled
      if (result.status === ScanDocumentResponseStatus.Success) {
        const imagePaths = result.scannedImages || [];

        for (let idx = 0; idx < imagePaths.length; idx++) {
          rotatedImagePaths.push(await rotateImageIfNeeded(imagePaths[idx]));
        }
      }

      if (images.length === 0 && rotatedImagePaths.length === 0) {
        navigation.navigate('Dashboard');
        // note: do not reset hasPendingImages here or the useEffect() hook will re-open the camera while navigating
      } else {
        addImages(rotatedImagePaths);
        setHasPendingImages(false);

        if (selectedImageIndex === undefined) {
          selectImage(0);
        }
      }
    } catch (reason) {
      captureError(reason, 'An error occurred while scanning documents');
      setHasPendingImages(false);
    }
  }, [addImages, images, navigation, selectedImageIndex, setHasPendingImages, selectImage]);

  useEffect(() => {
    if (!hasPendingImages && images.length === 0) {
      openCamera()
        .then()
        .catch((reason) => {
          captureError(reason, 'An error occurred while scanning documents');
        });
    }
  }, [images, hasPendingImages, openCamera]);

  const backgroundImage = useMemo(() => {
    if (images.length === 0 || selectedImageIndex === undefined) {
      // <ImageBackground /> requires an image, set a 1x1 pixel transparent PNG
      return {
        // eslint-disable-next-line max-len
        uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      };
    }

    if (selectedImageIndex >= images.length) {
      return { uri: images[images.length - 1] };
    }

    return { uri: images[selectedImageIndex] };
  }, [images, selectedImageIndex]);

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
        title: t('scan.menu_title') || undefined,
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
    startUploadProcess();
    setIsUploadModalOpen(true);
  }, [setIsUploadModalOpen, startUploadProcess]);

  const finishUpload = useCallback(
    (uploadSuccessful: boolean) => {
      setIsUploadModalOpen(false);

      if (uploadSuccessful) {
        setHasPendingImages(true);
        toDashboard();
      }
    },
    [setHasPendingImages, setIsUploadModalOpen, toDashboard],
  );

  const trashIconColor =
    images.length > 0 && selectedImageIndex !== undefined
      ? colors.scan.deleteIconColor
      : colors.scan.deleteIconDisabledColor;
  const trashIconFill =
    images.length > 0 && selectedImageIndex !== undefined
      ? colors.scan.deleteIconBackgroundColor
      : colors.scan.deleteIconDisabledBackgroundColor;

  return (
    <View style={styles.screenContainer}>
      <ScanUploadModalScreen isOpen={isUploadModalOpen} onClose={finishUpload} />
      <ImageBackground resizeMode="contain" source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.header}>
          <Text color={colors.white} spaceAfter={10} variant="bodyRegularBold">
            {t('scan.preview_title')}
          </Text>
        </View>
        <View style={styles.footerContainer}>
          <ScrollView contentContainerStyle={styles.previewsBar} horizontal={true}>
            {images.map((imagePath, index) => (
              <TouchableOpacity key={`preview_image_${imagePath}`} onPress={() => selectImage(index)}>
                <Image
                  resizeMode="cover"
                  source={{ uri: imagePath }}
                  style={index === selectedImageIndex ? styles.previewImageSelected : styles.previewImage}
                />
              </TouchableOpacity>
            ))}
            {hasPendingImages && <ActivityIndicator color={colors.white} size={40} style={styles.previewImageLoader} />}
          </ScrollView>
          <View style={styles.buttonBarContainer}>
            <View style={styles.buttonBar}>
              <TouchableOpacity hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }} onPress={goBack}>
                <SvgArrowLeftIcon
                  color={colors.scan.toggleEnabledColor}
                  fill={colors.scan.transparentBackground}
                  height={32}
                  width={32}
                />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }} onPress={openCamera}>
                <SvgPlusIcon
                  color={colors.scan.addIconColor}
                  fill={colors.scan.transparentBackground}
                  height={32}
                  hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
                  width={32}
                />
              </TouchableOpacity>
              <TouchableOpacity disabled={!isUploadEnabled} onPress={startUpload}>
                <SvgUploadIcon
                  color={isUploadEnabled ? colors.scan.uploadIconColor : colors.scan.uploadIconDisabledColor}
                  fill={colors.scan.transparentBackground}
                  height={72}
                  width={72}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={images.length === 0 || selectedImageIndex === undefined}
                hitSlop={{ bottom: 7, left: 8, right: 7, top: 8 }}
                onPress={deleteImage}
              >
                <SvgTrashIcon color={trashIconColor} fill={trashIconFill} height={33} width={33} />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }} onPress={showActionSheet}>
                <SvgEllipsisIcon
                  color={colors.scan.toggleEnabledColor}
                  fill={colors.scan.transparentBackground}
                  height={32}
                  width={32}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
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
