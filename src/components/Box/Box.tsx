import React, { useMemo } from 'react';
import type { ColorValue, DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

export type BoxStyleProps = {
  // padding;
  px?: number;
  py?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;

  // margin
  mx?: number;
  my?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;

  // border
  borderColor?: ColorValue;
  border?: number;
  borderTop?: number;
  borderRight?: number;
  borderBottom?: number;
  borderLeft?: number;

  height?: DimensionValue;
  width?: DimensionValue;
};

type Props = BoxStyleProps & {
  style?: StyleProp<ViewStyle>;
};

const Box: React.FC<React.PropsWithChildren<Props>> = ({ style, children, ...boxProps }) => {
  const styleSheet = useMemo(() => createStylesheetForBox(boxProps as BoxStyleProps), [boxProps]);
  return (
    <View style={[styleSheet.margin, styleSheet.padding, styleSheet.border, styleSheet.size, style]}>{children}</View>
  );
};

export const createStylesheetForBox = (props: BoxStyleProps) => {
  return StyleSheet.create({
    border: {
      borderBottomWidth: props.borderBottom,
      borderColor: props.borderColor,
      borderLeftWidth: props.borderLeft,
      borderRightWidth: props.borderRight,
      borderTopWidth: props.borderTop,
      borderWidth: props.border,
    },
    margin: {
      marginBottom: props.mb,
      marginHorizontal: props.mx,
      marginLeft: props.ml,
      marginRight: props.mr,
      marginTop: props.mt,
      marginVertical: props.my,
    },
    padding: {
      paddingBottom: props.pb,
      paddingHorizontal: props.px,
      paddingLeft: props.pl,
      paddingRight: props.pr,
      paddingTop: props.pt,
      paddingVertical: props.py,
    },
    size: {
      height: props.height,
      width: props.width,
    },
  });
};

export default React.memo(Box);
