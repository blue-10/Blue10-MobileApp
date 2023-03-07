import React, { useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { colors } from '../../theme';

type Props = {
  color?: string;
  highlightColor?: string;
  icon: React.FC<SvgProps>;
  size?: number;
  onPress?: () => void;
}

const IconButton: React.FC<Props> = ({
  color = colors.black,
  highlightColor = colors.button.primary.background,
  icon,
  size = 16,
  onPress,
}) => {
  const [currentColor, setCurrentColor] = useState(color);
  const iconElement = useMemo(() => React.createElement(
    icon,
    {
      color: currentColor,
      height: size,
      width: size,
    },
  ),
  [size, icon, currentColor]);

  return (
    <Pressable
      android_ripple={{
        borderless: true,
        color: highlightColor,
      }}
      onPressIn={() => setCurrentColor(highlightColor)}
      onPressOut={() => setCurrentColor(color)}
      onPress={onPress}
    >
      {iconElement}
    </Pressable>
  );
};

export default IconButton;
