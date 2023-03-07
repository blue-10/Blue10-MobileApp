import React, { useMemo } from 'react';
import { ColorValue, StyleSheet, Text as NativeText, TextProps, TextStyle } from 'react-native';

import { text, TextStyleType } from '../../theme';

export interface TextPropsWithStyle extends TextProps {
  variant?: TextStyleType;
  color?: ColorValue;
  style?: TextStyle;
  align?: TextStyle['textAlign'];
  spaceAfter?: number;
}

const Text: React.FC<TextPropsWithStyle> = ({
  color,
  variant = 'caption1Regular',
  align = 'left',
  spaceAfter,
  style,
  ...extraProps
}) => {
  const stylesheet = useMemo(() => StyleSheet.create(
    {
      align: {
        textAlign: align,
      },
      color: {
        color,
      },
      font: text[variant],
      spaceAfter: {
        marginBottom: spaceAfter,
      },
    }), [color, variant, align, spaceAfter]);

  return (
    <NativeText
      style={[
        stylesheet.color,
        stylesheet.font,
        stylesheet.align,
        stylesheet.spaceAfter,
        style]}
      {...extraProps}
    />);
};

export default React.memo(Text);
