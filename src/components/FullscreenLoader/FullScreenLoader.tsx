import type React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '../../theme';

export const FullScreenLoader: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
