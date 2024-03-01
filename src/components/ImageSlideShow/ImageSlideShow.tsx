import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { colors } from '../../theme';
import Box from '../Box/Box';

type Props = {
  images: string[];
  onPageSelected: (position: number) => void;
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
        <View key={`${index.toString()}:${image}`} style={styles.page}>
          {image ? (
            <Box height="100%" px={8} py={8} width="100%">
              <Image
                resizeMode="contain"
                source={{
                  uri: image,
                }}
                style={styles.image}
              />
            </Box>
          ) : (
            <ActivityIndicator color={colors.primary} size="large" />
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
