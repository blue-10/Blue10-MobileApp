import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, StyleSheet, View } from 'react-native';

import DefaultImagePreviewBackground from '../../assets/default-image-preview-background.png';
import SvgDocumentIcon from '../../assets/icons/document-icon.svg';
import SvgEllipsisIcon from '../../assets/icons/ellipsis-icon.svg';
import SvgLightningIcon from '../../assets/icons/lightning-icon.svg';
import SvgPlusIcon from '../../assets/icons/plus-icon.svg';
import SvgTrashIcon from '../../assets/icons/trash-icon.svg';
import SvgUploadIcon from '../../assets/icons/upload-icon.svg';
import Text from '../components/Text/Text';
import { RootStackParamList } from '../navigation/types';
import { colors, dimensions } from '../theme/';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanPreviewScreen'>;
type State = {
  images: any[];
  selectedImageIndex: number|null;
  isBlackWhiteModeEnabled: boolean;
  isDocumentRecognitionEnabled: boolean;
  isFlashEnabled: boolean;
};

export const ScanPreviewScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [state, setState] = useState<State>({
    images: [],
    isBlackWhiteModeEnabled: false,
    isDocumentRecognitionEnabled: true,
    isFlashEnabled: false,
    selectedImageIndex: null,
  });

  const isUploadEnabled = useMemo(() => state.images.length > 0, [state.images]);

  const addImageHandler = useMemo(() => (image: any) => setState({
    ...state,
    images: [...state.images, image],
  }), [state]);

  const deleteImage = useMemo(() => () => {
    if (state.selectedImageIndex === null) {
      return;
    }

    const newImages: typeof state.images = [];
    for (let idx = 0; idx < state.images.length; idx++) {
      if (idx !== state.selectedImageIndex) {
        newImages.push(state.images[idx]);
      }
    }

    let newSelectedImageIndex: number|null = state.selectedImageIndex - 1;
    if (newSelectedImageIndex < 0) {
      newSelectedImageIndex = 0;
    }
    if (newImages.length === 0) {
      newSelectedImageIndex = null;
    }

    setState({
      ...state,
      images: newImages,
      selectedImageIndex: newSelectedImageIndex,
    });
  }, [state, setState]);

  const openCamera = useMemo(() => () => {
    navigation.navigate(
      'ScanCameraScreen',
      {
        addImageHandler,
        isBlackWhiteModeEnabled: state.isBlackWhiteModeEnabled,
        isDocumentRecognitionEnabled: state.isDocumentRecognitionEnabled,
        isFlashEnabled: state.isFlashEnabled,
      },
    );
  }, [addImageHandler, navigation, state]);

  const backgroundImage = useMemo(
    () => {
      if (state.images.length === 0) {
        return DefaultImagePreviewBackground;
      }

      if (state.selectedImageIndex === null || state.selectedImageIndex >= state.images.length) {
        return state.images[state.images.length - 1];
      }

      return state.images[state.selectedImageIndex];
    },
    [state],
  );

  return (
    <View style={styles.screenContainer}>
      <ImageBackground source={backgroundImage} resizeMode="contain" style={styles.backgroundImage}>
        <View style={styles.header}>
          <Text variant="bodyRegularBold" spaceAfter={10} color={colors.white}>
            {t('scan.preview_title')}
          </Text>
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.activeOptionsBar}>
            {/* Is this a toggle switch or should it allow editing the cropping area of the selected image? */}
            {/* Will implement as toggle switch for now */}
            <SvgDocumentIcon
              color={(
                state.isDocumentRecognitionEnabled
                  ? colors.scan.toggleEnabledColor
                  : colors.scan.toggleDisabledColor
              )}
              fill="rgba(0, 0, 0, 0.6)"
              onPress={() => setState({
                ...state,
                isDocumentRecognitionEnabled: !state.isDocumentRecognitionEnabled,
              })}
              style={styles.activeOptionsButton}
              width={38}
              height={38}
            />
          </View>
          <View style={styles.previewsBar}>
            {/* Image previews here */}
            {/* onPress={setSelectedImageIndex} */}
          </View>
          <View style={styles.buttonBarContainer}>
            <View style={styles.buttonBar}>
              <SvgLightningIcon
                color={state.isFlashEnabled ? colors.scan.toggleEnabledColor : colors.scan.toggleDisabledColor}
                fill="rgba(0, 0, 0, 0.6)"
                onPress={() => setState({ ...state, isFlashEnabled: !state.isFlashEnabled })}
                width={32}
                height={32}
              />
              <SvgPlusIcon
                color={colors.scan.addIconColor}
                fill="rgba(0, 0, 0, 0.6)"
                onPress={openCamera}
                width={32}
                height={32}
              />
              <SvgUploadIcon
                color={isUploadEnabled ? colors.scan.uploadIconColor : colors.scan.uploadIconDisabledColor}
                fill="rgba(0, 0, 0, 0.6)"
                width={72}
                height={72}
              />
              <SvgTrashIcon
                color={(
                  state.images.length > 0 && state.selectedImageIndex !== null
                    ? colors.scan.deleteIconColor
                    : colors.scan.deleteIconDisabledColor
                )}
                fill={(
                  state.images.length > 0 && state.selectedImageIndex !== null
                    ? colors.scan.deleteIconBackgroundColor
                    : colors.scan.deleteIconDisabledBackgroundColor
                )}
                onPress={deleteImage}
                width={33}
                height={33}
              />
              <SvgEllipsisIcon
                color={colors.scan.toggleEnabledColor}
                fill="rgba(0, 0, 0, 0.6)"
                onPress={() => setState({ ...state, isFlashEnabled: !state.isFlashEnabled })}
                width={32}
                height={32}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  activeOptionsBar: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 82,
    justifyContent: 'flex-end',
  },
  activeOptionsButton: {
    marginEnd: 24,
  },
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: colors.white,
    height: 90,
    justifyContent: 'flex-end',
  },
  previewsBar: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: colors.white,
    flexDirection: 'row',
    height: 95,
    justifyContent: 'flex-start',
    overflow: 'scroll', // check this, we want the image previews to be horizontally scrollable if there are many images
  },
  screenContainer: {
    backgroundColor: colors.white,
    color: colors.black,
    flex: 1,
  },
});
