import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { InvoiceLine } from '../../entity/invoice/types';
import { colors, dimensions } from '../../theme';
import { numberToCurrency } from '../../utils/numberToCurrency';
import Box from '../Box/Box';
import Text from '../Text/Text';

type Props = {
  item: InvoiceLine;
  isEven: boolean;
}

export const InvoiceBookingItem: React.FC<Props> = ({ isEven, item }) => {
  const { t } = useTranslation();
  return (
    <Box
      style={[styles.container, !isEven ? styles.even : styles.odd]}
      px={dimensions.list.singleItem.paddingHorizontal}
      py={dimensions.list.singleItem.paddingVertical}
    >
      <Box style={styles.itemLeft}>
        <Text variant="bodyRegular">{item.ledgerNumber}</Text>
        <Text variant="caption1Regular" color={colors.labelLightSecondary}>{item.description}</Text>
      </Box>
      <Box>
        <Text variant="bodyRegular" align="right">
          {t('invoice_booking_item.netto')} {numberToCurrency(item.netAmount)}
        </Text>
        <Text variant="caption1Regular" align="right" color={colors.labelLightSecondary}>
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
