import React, { useMemo } from 'react';
import type { ColorValue, TouchableOpacityProps } from 'react-native';
import { TouchableOpacity } from 'react-native';
import type { SvgProps } from 'react-native-svg';

type ColorProps = {
  color?: ColorValue;
  fill?: ColorValue;
};

type Props = {
  isDisabled?: boolean;
  icon: React.FC<SvgProps>;
  size: number;
  defaultColor?: ColorProps;
  disabledColor?: ColorProps;
  hitSlop?: TouchableOpacityProps['hitSlop'];
  onPress?: () => void;
};

export const TouchableIcon: React.FC<Props> = ({
  isDisabled = false,
  defaultColor = {
    color: 'white',
    fill: 'rgba(0, 0, 0, 0.6)',
  },
  disabledColor = {
    color: '#808080',
    fill: 'rgba(0, 0, 0, 0.6)',
  },
  icon,
  size,
  hitSlop,
  onPress,
}) => {
  const iconElement = useMemo(
    () =>
      React.createElement(icon, {
        color: isDisabled ? disabledColor.color : defaultColor.color,
        fill: isDisabled ? disabledColor.fill : defaultColor.fill,
        height: size,
        width: size,
      }),
    [defaultColor.color, defaultColor.fill, disabledColor.color, disabledColor.fill, icon, isDisabled, size],
  );

  return (
    <TouchableOpacity disabled={isDisabled} hitSlop={hitSlop} onPress={onPress}>
      {iconElement}
    </TouchableOpacity>
  );
};
