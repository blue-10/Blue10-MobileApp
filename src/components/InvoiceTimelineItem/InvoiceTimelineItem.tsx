import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { InvoiceHistoryItem } from '../../entity/invoice/types';
import { colors, dimensions } from '../../theme';
import Box from '../Box/Box';
import Text from '../Text/Text';

type Props = {
  item: InvoiceHistoryItem;
  isEven: boolean;
}

const InvoiceTimelineItem: React.FC<Props> = ({ item, isEven }) => {
  const { t } = useTranslation();

  return (
    <Box
      style={[styles.container, !isEven ? styles.even : styles.odd]}
      px={dimensions.list.singleItem.paddingHorizontal}
      py={dimensions.list.singleItem.paddingVertical}
    >
      <Box style={styles.leftBox}>
        <Text variant="bodyRegular">{format(item.date, 'dd MM yy')}</Text>
        <Text variant="caption1Regular" color={colors.labelLightSecondary}>
          {t('invoice_timeline_item.date')}
        </Text>
      </Box>
      <Box style={styles.rightBox}>
        <Text variant="bodyRegular">{item.actionText}</Text>
        <Box style={styles.subTitleContainer}>
          <Text variant="caption1Regular" color={colors.labelLightSecondary} style={styles.actionLabel}>
            {t('invoice_timeline_item.action')}
          </Text>
          <Text variant="caption1Regular" color={colors.labelLightSecondary} align="right">
            {item.userAbbreviation} &gt; {item.toUserAbbreviation}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoiceTimelineItem;

const styles = StyleSheet.create({
  actionLabel: {
    flex: 1,
  },
  actionTitle: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
  },
  even: {
    backgroundColor: colors.list.even.background,
  },
  leftBox: {
    width: 75,
  },
  odd: {
    backgroundColor: colors.list.odd.background,
  },
  rightBox: {
    flex: 1,
  },
  subTitleContainer: {
    flexDirection: 'row',
  },
});
