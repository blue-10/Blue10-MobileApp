import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { colors } from '../../theme';
import Box from '../Box/Box';

type Props = {
  images: string[];
  onPageSelected: (position: number) => void;
}

export const ImageGallery: React.FC<Props> = ({ images, onPageSelected }) => {
  return (
    <PagerView
      style={styles.container}
      initialPage={0}
      onPageSelected={(event) => {
        onPageSelected(event.nativeEvent.position);
      }}
    >
      {images.map((image, index) => (
        <View style={styles.page} key={`${index.toString()}:${image}`}>
          {image
            ? (
              <Box width="100%" height="100%" px={8} py={8}>
                <Image
                  style={styles.image}
                  source={{
                    uri: image,
                  }}
                  resizeMode="contain"
                />
              </Box>
            )
            : (
              <ActivityIndicator size="large" color={colors.primary} />
            )}
        </View>
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
    width: '100%',
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
