import { useActionSheet } from '@expo/react-native-action-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import DocumentScanner, { ResponseType, ScanDocumentResponseStatus } from 'react-native-document-scanner-plugin';
import * as Sentry from 'sentry-expo';

// @ts-ignore
import DefaultImagePreviewBackground from '../../assets/default-image-preview-background.png';
import SvgArrowLeftIcon from '../../assets/icons/arrow-round-left.svg';
import SvgEllipsisIcon from '../../assets/icons/ellipsis-icon.svg';
import SvgPlusIcon from '../../assets/icons/plus-icon.svg';
import SvgTrashIcon from '../../assets/icons/trash-icon.svg';
import SvgUploadIcon from '../../assets/icons/upload-icon.svg';
import Text from '../components/Text/Text';
import { useGetCurrentCustomer } from '../hooks/queries/useGetCurrentCustomer';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';
import { RootStackParamList } from '../navigation/types';
import { useImageStore } from '../store/ImageStore';
import { colors, dimensions } from '../theme/';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanPreviewScreen'>;

export const ScanPreviewScreen: React.FC<Props> = ({ navigation }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const {
    addImages,
    deleteImage,
    images,
    reset,
    selectedImageIndex,
    selectImage,
  } = useImageStore();
  const { t } = useTranslation();
  const currentCustomer = useGetCurrentCustomer();
  const { currentUser } = useGetCurrentUser();

  const isUploadEnabled = useMemo(() => images.length > 0, [images]);

  const openCamera = useCallback(() => {
    DocumentScanner.scanDocument({
      croppedImageQuality: 100,
      letUserAdjustCrop: true,
      responseType: ResponseType.ImageFilePath,
    })
      .then((result) => {
        // If the status is not Success, the user cancelled
        if (result.status === ScanDocumentResponseStatus.Success) {
          addImages(result.scannedImages || []);
        }
      })
      .catch(() => {
        Sentry.Native.captureMessage('Error occurred while scanning documents', 'error');
      });
  }, [addImages]);

  const backgroundImage = useMemo(
    () => {
      if (images.length === 0 || selectedImageIndex === undefined) {
        return DefaultImagePreviewBackground;
      }

      if (selectedImageIndex >= images.length) {
        return { uri: images[images.length - 1] };
      }

      return { uri: images[selectedImageIndex] };
    },
    [images, selectedImageIndex],
  );

  const toDashboard = useCallback(() => {
    reset();
    navigation.navigate('Dashboard');
  }, [navigation, reset]);

  const showActionSheet = useCallback(() => {
    const options = [
      t('scan.menu_dashboard'),
      t('scan.menu_cancel'),
    ];

    showActionSheetWithOptions({
      cancelButtonIndex: 1,
      message: `${currentUser?.Name} - ${currentCustomer.customerName}`,
      options,
      title: t('scan.menu_title') || undefined,
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case 0:
          toDashboard();
          break;
      }
    });
  }, [
    currentCustomer,
    currentUser,
    showActionSheetWithOptions,
    t,
    toDashboard,
  ]);

  return (
    <View style={styles.screenContainer}>
      <ImageBackground source={backgroundImage} resizeMode="contain" style={styles.backgroundImage}>
        <View style={styles.header}>
          <Text variant="bodyRegularBold" spaceAfter={10} color={colors.white}>
            {t('scan.preview_title')}
          </Text>
        </View>
        <View style={styles.footerContainer}>
          <ScrollView horizontal={true} contentContainerStyle={styles.previewsBar}>
            {images.map((imagePath, index) => (
              <TouchableOpacity key={`preview_image_${imagePath}`} onPress={() => selectImage(index)}>
                <Image
                  source={{ uri: imagePath }}
                  resizeMode="cover"
                  style={index === selectedImageIndex ? styles.previewImageSelected : styles.previewImage}
                />
              </TouchableOpacity>
            ))}
            {/* Image previews here */}
            {/* onPress={setSelectedImageIndex} */}
          </ScrollView>
          <View style={styles.buttonBarContainer}>
            <View style={styles.buttonBar}>
              <TouchableOpacity onPress={toDashboard} hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}>
                <SvgArrowLeftIcon
                  color={colors.scan.toggleEnabledColor}
                  fill={colors.scan.transparentBackground}
                  width={32}
                  height={32}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={openCamera} hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}>
                <SvgPlusIcon
                  color={colors.scan.addIconColor}
                  fill={colors.scan.transparentBackground}
                  width={32}
                  height={32}
                  hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
                />
              </TouchableOpacity>
              <TouchableOpacity disabled={!isUploadEnabled} onPress={undefined}>
                <SvgUploadIcon
                  color={isUploadEnabled ? colors.scan.uploadIconColor : colors.scan.uploadIconDisabledColor}
                  fill={colors.scan.transparentBackground}
                  width={72}
                  height={72}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={images.length === 0 || selectedImageIndex === undefined}
                onPress={deleteImage}
                hitSlop={{ bottom: 7, left: 8, right: 7, top: 8 }}
              >
                <SvgTrashIcon
                  color={(
                    images.length > 0 && selectedImageIndex !== undefined
                      ? colors.scan.deleteIconColor
                      : colors.scan.deleteIconDisabledColor
                  )}
                  fill={(
                    images.length > 0 && selectedImageIndex !== undefined
                      ? colors.scan.deleteIconBackgroundColor
                      : colors.scan.deleteIconDisabledBackgroundColor
                  )}
                  width={33}
                  height={33}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={showActionSheet} hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}>
                <SvgEllipsisIcon
                  color={colors.scan.toggleEnabledColor}
                  fill={colors.scan.transparentBackground}
                  width={32}
                  height={32}
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
