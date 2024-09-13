import type { TextProps } from 'react-native';

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
  // eslint-disable-next-line react/boolean-prop-naming
  valueAdjustsFontSizeToFit?: boolean;
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
}) => {
  const tableColor = colors.labelLightSecondary;
  return (
    <>
      <LoaderWrapper heightOfTextStyle="bodyRegular" isLoading={isValueLoading} width={valueLoadingWidth}>
        <Text
          adjustsFontSizeToFit={valueAdjustsFontSizeToFit}
          color={tableColor}
          ellipsizeMode={valueEllipsizeMode}
          numberOfLines={valueNumberOfLines}
          variant="bodyRegular"
        >
          {value}
        </Text>
      </LoaderWrapper>
      <LoaderWrapper heightOfTextStyle="caption1Regular" isLoading={isLabelLoading} width={labelLoadingWidth}>
        <Text
          color={tableColor}
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
