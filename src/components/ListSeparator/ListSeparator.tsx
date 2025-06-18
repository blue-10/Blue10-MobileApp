import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, dimensions } from '../../theme';

export const ListSeparator: React.FC = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    backgroundColor: colors.list.separator,
    height: dimensions.list.separatorHeight,
  },
});
