import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

import { colors, text, TextStyleType } from '../../theme';
import Box, { BoxStyleProps } from '../Box/Box';

type Props = BoxStyleProps & {
  isLoading?: boolean;
  height?: number;
  width?: number;
  heightOfTextStyle?: TextStyleType;
  children: React.ReactElement;
}

const LoaderWrapper: React.FC<Props> = ({
  height = 17,
  width,
  heightOfTextStyle,
  isLoading,
  children,
  ...boxProps
}) => {
  const boxPropsUse = { ...boxProps };
  let useHeight = height;
  const useWidth = width ?? 100;

  // use height based of text style
  if (heightOfTextStyle) {
    const textStyle = text[heightOfTextStyle];
    useHeight = textStyle.fontSize ?? 0;
    boxPropsUse.mb = (textStyle.lineHeight ?? 0) - useHeight;
  }

  return isLoading
    ? (
      <Box
        {...boxPropsUse}
        style={{
          height: useHeight,
          width: useWidth,
        }}
      >
        <ContentLoader
          viewBox={`0 0 ${useWidth} ${useHeight}`}
          width={useWidth}
          height={useHeight}
          backgroundColor={colors.white}
          foregroundColor={colors.borderColor}
          preserveAspectRatio="left"
        >
          <Rect x={0} y={0} width={useWidth} height={useHeight} />
        </ContentLoader>
      </Box>
    )
    : children;
};

export default LoaderWrapper;
