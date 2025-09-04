import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import type { InvoiceHistoryItem } from '../../entity/invoice/types';
import { colors, dimensions } from '../../theme';
import Box from '../Box/Box';
import Text from '../Text/Text';
import ExpandableText from '../ExpandableText/ExpandableText';

type Props = {
  item: InvoiceHistoryItem;
  isEven: boolean;
  id: number;
};

const InvoiceTimelineItem: React.FC<Props> = ({ item, isEven, id }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box
        px={dimensions.list.singleItem.paddingHorizontal}
        py={dimensions.list.singleItem.paddingVertical}
        style={[styles.container, !isEven ? styles.even : styles.odd]}
      >
        <Box>
          <Text variant="bodyRegular">{format(item.date, 'dd MM yy')}</Text>
          <Text color={colors.labelLightSecondary} variant="caption1Regular">
            {t('invoice_timeline_item.date')}
          </Text>
        </Box>
        <Box>
          <Text variant="bodyRegular">{item.actionText}</Text>
          <Box>
            <Text color={colors.labelLightSecondary} style={styles.actionLabel} variant="caption1Regular">
              {t('invoice_timeline_item.action')}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box
        px={dimensions.list.singleItem.paddingHorizontal}
        py={dimensions.list.singleItem.paddingVertical}
        style={[styles.remark, !isEven ? styles.even : styles.odd, {}]}
      >
        <Box width={'65%'}>
          <ExpandableText text={item.remark ?? ''} initiallyExpanded={id === 0} widthPercent={65} />
        </Box>
        <Box style={{ marginLeft: 8, marginRight: 8, width: '35%' }}>
          <ExpandableText
            text={`${item.userAbbreviation} > ${item.toUserAbbreviation}`}
            initiallyExpanded={id === 0}
            widthPercent={35}
            color={colors.labelLightSecondary}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InvoiceTimelineItem;

const styles = StyleSheet.create({
  actionLabel: {
    flex: 1,
    textAlign: 'right',
  },
  actionTitle: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
  remark: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // Android Shadow
    elevation: 5,
  },
});
