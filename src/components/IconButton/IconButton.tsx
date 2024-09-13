import React, { useMemo, useState } from 'react';
import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import { colors } from '../../theme';

type Props = {
  color?: string;
  highlightColor?: string;
  icon: React.FC<SvgProps>;
  size?: number;
  style?: PressableProps['style'];
  svgProps?: SvgProps;
  onPress?: () => void;
};

const IconButton: React.FC<Props> = ({
  color = colors.black,
  highlightColor = colors.button.primary.background,
  icon,
  size = 16,
  style,
  svgProps,
  onPress,
}) => {
  const [currentColor, setCurrentColor] = useState(color);
  const iconElement = useMemo(
    () =>
      React.createElement(icon, {
        ...svgProps,
        color: currentColor,
        height: size,
        width: size,
      }),
    [icon, currentColor, size, svgProps],
  );

  return (
    <Pressable
      android_ripple={{
        borderless: true,
        color: highlightColor,
      }}
      style={style}
      onPress={onPress}
      onPressIn={() => setCurrentColor(highlightColor)}
      onPressOut={() => setCurrentColor(color)}
    >
      {iconElement}
    </Pressable>
  );
};

export default IconButton;
