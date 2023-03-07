import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { colors, TextStyleType } from '../../theme';
import Text, { TextPropsWithStyle } from '../Text/Text';

type Props = {
  isLoading?: boolean;
  isDisabled?: boolean;
  title: string;
  onPress: () => void;
  size: 'L' | 'M' | 'S';
  variant: 'grey' | 'greyClear' | 'primary' | 'primaryClear' | 'secondary' | 'secondaryClear';
  style?: ViewStyle;
  iconLeft?: React.FunctionComponent<SvgProps>;
  iconRight?: React.FunctionComponent<SvgProps>;
  iconSize?: number;
  textAlign?: TextPropsWithStyle['align'];
}

const Button: React.FC<Props> = (
  {
    isDisabled = false,
    isLoading = false,
    title,
    size,
    variant,
    style,
    iconLeft,
    iconRight,
    iconSize = 34,
    textAlign = 'center',
    onPress,
  },
) => {
  const containerStyles = useMemo(() => {
    const retValue = [];

    switch (variant) {
      case 'grey':
        retValue.push(styles.variantGrey);
        break;
      case 'secondary':
        retValue.push(styles.variantSecondary);
        break;
      case 'primary':
        retValue.push(styles.variantPrimary);
        break;
    }

    switch (size) {
      case 'L':
        retValue.push(styles.containerSizeLarge);
        break;
      case 'S':
        retValue.push(styles.containerSizeSmall);
        break;
      default:
        retValue.push(styles.containerSizeMedium);
        break;
    }

    return retValue;
  }, [variant, size]);

  const textVariant: TextStyleType = useMemo(() => {
    switch (size) {
      case 'L':
        return 'buttonLarge';
      case 'S':
        return 'buttonSmall';
      default:
        return 'buttonMedium';
    }
  }, [size]);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        ...containerStyles,
        isLoading ? styles.isLoading : {},
        isDisabled ? styles.isDisabled : {},
        style,
      ]}
      disabled={isLoading || isDisabled}
      onPress={onPress}
    >
      {iconLeft && React.createElement(
        iconLeft,
        {
          color: colors.button[variant].text,
          height: iconSize,
          width: iconSize,
        },
      )}
      <Text
        align={textAlign}
        variant={textVariant}
        color={colors.button[variant].text}
        style={{
          ...styles.text,
          paddingLeft: iconLeft ? 8 : 0,
          paddingRight: iconRight ? 8 : 0,
        }}
      >
        {title}
      </Text>
      {isLoading && (<ActivityIndicator style={styles.loader} size="large" color={colors.button[variant].text} />)}
      {iconRight && React.createElement(
        iconRight,
        {
          color: colors.button[variant].text,
          height: iconSize,
          width: iconSize,
        })}
    </TouchableOpacity>
  );
};

export default React.memo(Button);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 0,
  },
  containerSizeLarge: {
    borderRadius: 35,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  containerSizeMedium: {
    borderRadius: 35,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  containerSizeSmall: {
    borderRadius: 1000,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  isDisabled: {
    opacity: 0.5,
  },
  isLoading: {
    opacity: 0.5,
  },
  loader: {
    bottom: '50%',
    position: 'absolute',
    right: 10,
    top: '50%',
  },
  text: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
  },
  variantGrey: {
    backgroundColor: colors.button.grey.background,
  },
  variantPrimary: {
    backgroundColor: colors.button.primary.background,
  },
  variantSecondary: {
    backgroundColor: colors.button.secondary.background,
  },
});
