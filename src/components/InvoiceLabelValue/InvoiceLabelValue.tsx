import type { ColorValue, TextProps } from 'react-native';

import { colors } from '../../theme';
import LoaderWrapper from '../LoaderWrapper/LoaderWrapper';
import Text from '../Text/Text';

type Props = {
  label?: string | null;
  isLabelLoading?: boolean;
  labelLoadingWidth?: number;
  labelValueWidth?: number;
  labelNumberOfLines?: number;
  labelEllipsizeMode?: TextProps['ellipsizeMode'];
  value?: string;
  isValueLoading?: boolean;
  valueLoadingWidth?: number;
  valueNumberOfLines?: number;
  valueEllipsizeMode?: TextProps['ellipsizeMode'];
  valueAdjustsFontSizeToFit?: boolean;
  color?: ColorValue;
};

export const InvoiceLabelValue: React.FC<Props> = ({
  value,
  isValueLoading = false,
  valueLoadingWidth = 80,
  valueNumberOfLines,
  valueEllipsizeMode,
  valueAdjustsFontSizeToFit,

  label,
  isLabelLoading = false,
  labelLoadingWidth = 80,
  labelNumberOfLines,
  labelEllipsizeMode,
  color = colors.labelLightSecondary,
}) => {
  return (
    <>
      <LoaderWrapper heightOfTextStyle="bodyRegular" isLoading={isValueLoading} width={valueLoadingWidth}>
        <Text
          adjustsFontSizeToFit={valueAdjustsFontSizeToFit}
          color={color}
          ellipsizeMode={valueEllipsizeMode}
          numberOfLines={valueNumberOfLines}
          variant="bodyRegular"
        >
          {value}
        </Text>
      </LoaderWrapper>
      <LoaderWrapper heightOfTextStyle="caption1Regular" isLoading={isLabelLoading} width={labelLoadingWidth}>
        <Text
          color={color}
          ellipsizeMode={labelEllipsizeMode}
          numberOfLines={labelNumberOfLines}
          variant="caption1Regular"
        >
          {label}
        </Text>
      </LoaderWrapper>
    </>
  );
};
