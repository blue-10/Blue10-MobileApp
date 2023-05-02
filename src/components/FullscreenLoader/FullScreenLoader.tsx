import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '../../theme';

export const FullScreenLoader: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
