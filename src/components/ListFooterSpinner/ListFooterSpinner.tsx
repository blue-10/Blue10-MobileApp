import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, dimensions } from '../../theme';

export const ListFooterSpinner: React.FC = () => (
  <View style={styles.footerSpinner}>
    <ActivityIndicator color={colors.primary} size="large" />
  </View>
);

const styles = StyleSheet.create({
  footerSpinner: {
    borderTopColor: colors.list.separator,
    borderTopWidth: 1,
    paddingVertical: dimensions.spacing.normal,
  },
});
