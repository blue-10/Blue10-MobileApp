import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import type { InvoiceLine } from '../../entity/invoice/types';
import { colors, dimensions } from '../../theme';
import { numberToCurrency } from '../../utils/numberToCurrency';
import Box from '../Box/Box';
import Text from '../Text/Text';

type Props = {
  item: InvoiceLine;
  isEven: boolean;
};

export const InvoiceBookingItem: React.FC<Props> = ({ isEven, item }) => {
  const { t } = useTranslation();
  return (
    <Box
      px={dimensions.list.singleItem.paddingHorizontal}
      py={dimensions.list.singleItem.paddingVertical}
      style={[styles.container, !isEven ? styles.even : styles.odd]}
    >
      <Box style={styles.itemLeft}>
        <Text variant="bodyRegular">{item.ledgerNumber}</Text>
        <Text color={colors.labelLightSecondary} variant="caption1Regular">
          {item.description}
        </Text>
      </Box>
      <Box>
        <Text align="right" variant="bodyRegular">
          {t('invoice_booking_item.netto')} {numberToCurrency(item.netAmount)}
        </Text>
        <Text align="right" color={colors.labelLightSecondary} variant="caption1Regular">
          {t('invoice_booking_item.bruto')} {numberToCurrency(item.grossAmount)}
        </Text>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  even: {
    backgroundColor: colors.list.even.background,
  },
  itemLeft: {
    flex: 1,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  odd: {
    backgroundColor: colors.list.odd.background,
  },
});
