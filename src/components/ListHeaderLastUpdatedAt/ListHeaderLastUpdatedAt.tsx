import { format } from 'date-fns';
import { Trans, useTranslation } from 'react-i18next';

import { colors, dimensions } from '../../theme';
import Box from '../Box/Box';
import Text from '../Text/Text';

type Props = {
  lastUpdatedAt: number;
};

export const ListHeaderLastUpdatedAt: React.FC<Props> = ({ lastUpdatedAt }) => {
  const { t } = useTranslation();
  return (
    <Box px={dimensions.list.singleItem.paddingHorizontal} py={dimensions.list.singleItem.paddingVertical}>
      <Text color={colors.labelLightSecondary} variant="bodyRegular">
        {format(new Date(lastUpdatedAt), 'dd-MM-yyyy HH:mm')}
      </Text>
      <Text color={colors.labelLightSecondary} variant="caption1Regular">
        <Trans t={t}>list_header.last_updated_at</Trans>
      </Text>
    </Box>
  );
};
