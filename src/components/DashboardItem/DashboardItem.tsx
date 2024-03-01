import type React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, dimensions } from '../../theme';

type Props = {
  isLoading: boolean;
  title?: string | null;
  contentTitle?: string;
  color: string;
  textColor?: string;
  onPress?: () => void;
};

export const DashboardItem: React.FC<React.PropsWithChildren<Props>> = ({
  isLoading,
  title,
  contentTitle,
  color,
  textColor = colors.white,
  onPress,
  children,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={isLoading}
        style={[
          styles.button,
          {
            backgroundColor: color,
            opacity: isLoading ? 0.5 : 1,
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
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    marginBottom: 5,
  },
  container: {
    borderRadius: 20,
    height: 180,
    marginBottom: 10,
    width: '48%',
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
