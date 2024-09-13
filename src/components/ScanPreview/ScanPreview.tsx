import { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import SvgArrowLeftIcon from '../../../assets/icons/arrow-round-left.svg';
import SvgEllipsisIcon from '../../../assets/icons/ellipsis-icon.svg';
import SvgPlusIcon from '../../../assets/icons/plus-icon.svg';
import SvgTrashIcon from '../../../assets/icons/trash-icon.svg';
import SvgUploadIcon from '../../../assets/icons/upload-icon.svg';
import { colors, dimensions } from '../../theme';
import Text from '../Text/Text';
import { TouchableIcon } from '../TouchableIcon/TouchableIcon';

type Props = {
  title: string;
  images: string[];
  selectedImageIndex?: number;
  hasPendingImages: boolean;
  isUploadEnabled: boolean;
  onSelectImage: (index: number) => void;
  onGoBack: () => void;
  onOpenCamera: () => void;
  onStartUpload: () => void;
  onDeleteCurrentImage: () => void;
  onEllipsesClick?: () => void;
};

export const ScanPreview: React.FC<Props> = ({
  title,
  images,
  hasPendingImages,
  selectedImageIndex,
  isUploadEnabled,
  onSelectImage,
  onGoBack,
  onOpenCamera,
  onStartUpload,
  onDeleteCurrentImage,
  onEllipsesClick,
}) => {
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

  return (
    <ImageBackground resizeMode="contain" source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.header}>
        <Text color={colors.white} spaceAfter={10} variant="bodyRegularBold">
          {title}
        </Text>
      </View>
      <View style={styles.footerContainer}>
        <ScrollView contentContainerStyle={styles.previewsBar} horizontal={true}>
          {images.map((imagePath, index) => (
            <TouchableOpacity key={`preview_image_${imagePath}`} onPress={() => onSelectImage(index)}>
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
            <TouchableIcon
              defaultColor={{
                color: colors.scan.toggleEnabledColor,
                fill: colors.scan.transparentBackground,
              }}
              hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
              icon={SvgArrowLeftIcon}
              size={32}
              onPress={onGoBack}
            />
            <TouchableIcon
              defaultColor={{
                color: colors.scan.addIconColor,
                fill: colors.scan.transparentBackground,
              }}
              hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
              icon={SvgPlusIcon}
              size={32}
              onPress={onOpenCamera}
            />
            <TouchableIcon
              defaultColor={{
                color: colors.scan.uploadIconColor,
                fill: colors.scan.transparentBackground,
              }}
              disabledColor={{
                color: colors.scan.uploadIconDisabledColor,
                fill: colors.scan.transparentBackground,
              }}
              icon={SvgUploadIcon}
              isDisabled={!isUploadEnabled}
              size={72}
              onPress={onStartUpload}
            />
            <TouchableIcon
              defaultColor={{
                color: colors.scan.deleteIconColor,
                fill: colors.scan.deleteIconBackgroundColor,
              }}
              disabledColor={{
                color: colors.scan.deleteIconDisabledColor,
                fill: colors.scan.deleteIconDisabledBackgroundColor,
              }}
              hitSlop={{ bottom: 7, left: 8, right: 7, top: 8 }}
              icon={SvgTrashIcon}
              isDisabled={images.length === 0 || selectedImageIndex === undefined}
              size={33}
              onPress={onDeleteCurrentImage}
            />
            {onEllipsesClick ? (
              <TouchableIcon
                defaultColor={{
                  color: colors.scan.toggleEnabledColor,
                  fill: colors.scan.transparentBackground,
                }}
                hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
                icon={SvgEllipsisIcon}
                size={32}
                onPress={onEllipsesClick}
              />
            ) : (
              <View style={{ height: 32, width: 32 }} />
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
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
});
