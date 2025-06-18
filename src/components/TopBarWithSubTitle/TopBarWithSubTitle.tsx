import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { dimensions } from '../../theme';

type Props = {
  title: string;
  subTitle: string;
};

export const TopBarWithSubTitle: React.FC<Props> = ({ title, subTitle }) => {
  return (
    <View>
      <Text style={styles.topBarMultilineHeaderText}>{title}</Text>
      <Text style={styles.topBarMultilineSubtitleText}>{subTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // @see @react-navigation\elements\src\Header\HeaderTitle.tsx
  topBarMultilineHeaderText: Platform.select({
    android: {
      fontFamily: 'sans-serif-medium',
      fontSize: dimensions.fontSizes.large,
      fontWeight: 'normal',
    },
    default: {
      fontSize: dimensions.fontSizes.medium,
      fontWeight: '500',
    },
    ios: {
      fontSize: 17,
      fontWeight: '600',
    },
  }),

  topBarMultilineSubtitleText: {
    fontSize: dimensions.fontSizes.normal,
    fontWeight: '200',
  },
});
