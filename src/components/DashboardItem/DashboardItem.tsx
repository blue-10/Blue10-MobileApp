import React from 'react';
import type { DimensionValue } from 'react-native';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, dimensions } from '../../theme';

type Props = {
  isLoading: boolean;
  title?: string | null;
  contentTitle?: string;
  color: string;
  textColor?: string;
  buttonSize?: DimensionValue;
  onPress?: () => void;
};

export const DashboardItem: React.FC<React.PropsWithChildren<Props>> = ({
  isLoading,
  title,
  contentTitle,
  color,
  textColor = colors.white,
  buttonSize = 158,
  onPress,
  children,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: buttonSize,
        },
      ]}
    >
      <TouchableOpacity
        disabled={isLoading}
        style={[
          styles.button,
          {
            backgroundColor: color,
            height: buttonSize,
            opacity: isLoading ? 0.5 : 1,
            width: buttonSize,
          },
        ]}
        onPress={onPress}
      >
        {contentTitle && <Text style={[styles.contentTitle, { color: textColor }]}>{contentTitle}</Text>}
        {children}
        {isLoading && <ActivityIndicator color={colors.button.primary.text} size="large" style={styles.loader} />}
      </TouchableOpacity>
      {title && <Text style={[styles.subTitle]}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    marginBottom: 10,
  },
  container: {
    marginBottom: 4,
  },
  contentTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loader: {
    bottom: '50%',
    left: '50%',
    position: 'absolute',
    right: '50%',
    top: '50%',
  },

  subTitle: {
    color: colors.secondaryText,
    fontSize: dimensions.fontSizes.normal,
    textAlign: 'center',
  },
});
