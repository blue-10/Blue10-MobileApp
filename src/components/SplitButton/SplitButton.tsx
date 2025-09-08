import React, { useMemo } from 'react';
import type { ViewStyle } from 'react-native';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import type { TextStyleType } from '../../theme';
import { colors } from '../../theme';
import type { TextPropsWithStyle } from '../Text/Text';
import Text from '../Text/Text';
import Svg, { Path } from 'react-native-svg';

export type SplitButtonProps = {
  isLoading?: boolean;
  isDisabled?: boolean;
  title: string;
  onPress: () => void;
  onArrowPress: () => void;
  size: 'L' | 'M' | 'S';
  variant: 'grey' | 'greyClear' | 'primary' | 'primaryClear' | 'secondary' | 'secondaryClear';
  style?: ViewStyle;
  iconLeft?: React.FunctionComponent<SvgProps>;
  iconSize?: number;
  textAlign?: TextPropsWithStyle['align'];
};

const SplitButton: React.FC<SplitButtonProps> = ({
  isDisabled = false,
  isLoading = false,
  title,
  size,
  variant,
  style,
  iconLeft,
  iconSize = 24,
  textAlign = 'center',
  onPress,
  onArrowPress,
}) => {
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

  const arrowButtonHeight = useMemo(() => {
    switch (size) {
      case 'L':
        return 53;
      case 'S':
        return 44;
      default:
        return 47;
    }
  }, [size]);

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
    <View style={[styles.splitContainer, style]}>
      {/* Main Button */}
      <TouchableOpacity
        disabled={isLoading || isDisabled}
        style={[styles.mainButton, ...containerStyles]}
        onPress={onPress}
      >
        {iconLeft &&
          React.createElement(iconLeft, {
            color: colors.button[variant].text,
            height: iconSize,
            width: iconSize,
          })}
        <Text
          align={textAlign}
          color={colors.button[variant].text}
          numberOfLines={1}
          style={{ flex: 1, textAlign: 'center', paddingLeft: iconLeft ? 8 : 0 }}
          variant={textVariant}
        >
          {title}
        </Text>
        {isLoading && <ActivityIndicator color={colors.button[variant].text} size="small" style={styles.loader} />}
      </TouchableOpacity>

      <TouchableOpacity
        disabled={isDisabled}
        style={[
          styles.arrowButton,
          styles.variantSplitSide,
          styles[`variant${capitalize(variant)}` as keyof typeof styles],
          { height: arrowButtonHeight },
        ]}
        onPress={onArrowPress}
      >
        <Text color={colors.button[variant].text} variant={textVariant}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill={colors.button.iconColor}>
            <Path d="M6 14L12 8L18 14" stroke={colors.button.iconColor} />
          </Svg>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(SplitButton);

// Capitalize helper
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  splitContainer: {
    flexDirection: 'row',
    borderRadius: 35,
    overflow: 'hidden',
    alignItems: 'center',
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 58,
    paddingVertical: 12,
  },
  arrowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 62,
  },
  containerSizeLarge: {
    paddingVertical: 16,
  },
  containerSizeMedium: {
    paddingVertical: 14,
  },
  containerSizeSmall: {
    paddingVertical: 14,
  },
  loader: {
    marginLeft: 8,
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
  variantSplitSide: {
    borderLeftWidth: 1,
    borderLeftColor: colors.button.grey.background,
  },
});