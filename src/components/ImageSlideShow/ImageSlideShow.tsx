import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { colors } from '../../theme';
import Box from '../Box/Box';
import Text from '../Text/Text';

type Props = {
  images: string[];
  onPageSelected: (position: number) => void;
};

const ImageGalleryItem: React.FC<{ image?: string; index: number }> = ({ image, index }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.page}>
      {image ? (
        <Box height="100%" px={8} py={8} width="100%">
          <Image source={{ uri: image }} style={styles.image} />
        </Box>
      ) : (
        <Box height="100%" px={8} py={8} style={styles.page} width="100%">
          <Box pb={16}>
            <ActivityIndicator color={colors.primary} size="large" />
          </Box>
          <Text variant="bodyRegularBold">{t('image_slide_show.loading_image', { index: index + 1 })}</Text>
        </Box>
      )}
    </View>
  );
};

export const ImageGallery: React.FC<Props> = ({ images, onPageSelected }) => {
  return (
    <PagerView
      initialPage={0}
      style={styles.container}
      onPageSelected={(event) => {
        onPageSelected(event.nativeEvent.position);
      }}
    >
      {images.map((image, index) => (
        <ImageGalleryItem key={`${index.toString()}:${image}`} image={image} index={index} />
      ))}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    height: '100%',
    resizeMode: 'contain',
    width: '100%',
  },
  page: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
