import type React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { colors } from '../../theme';
import Box from '../Box/Box';
import Text from '../Text/Text';

type FullScreenLoaderProps = {
  text?: string;
};

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ text }) => {
  return (
    <Box style={styles.container}>
      <Box pb={text ? 16 : 0}>
        <ActivityIndicator color={colors.primary} size="large" />
      </Box>
      {text && <Text variant="bodyRegularBold">{text}</Text>}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
