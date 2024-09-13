import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';

import { useInvoiceSearchQuery } from '@/hooks/queries/useInvoiceSearchQuery';
import { useNavigateToInvoice } from '@/hooks/useNavigateToInvoice';
import { useSearchFilterStore } from '@/store/SearchFilterStore';

import ArrowLeftIcon from '../../../assets/icons/arrow-round-left.svg';
import ArrowRightIcon from '../../../assets/icons/arrow-round-right.svg';
import { colors } from '../../theme';
import Box from '../Box/Box';
import Button from '../Button/Button';

type Props = {
  currentInvoiceId: string;
  isDisabled?: boolean;
};

const borderColor = colors.borderColor;

export const InvoiceDetailsNavigation: React.FC<Props> = ({ currentInvoiceId, isDisabled = false }) => {
  const isIOS = Platform.OS === 'ios';
  const { t } = useTranslation();
  const lastFilter = useSearchFilterStore((store) => store.lastFilter);
  const navigateToInvoice = useNavigateToInvoice();

  const {
    all: allInvoices,
    getIndexById,
    getNextInvoice,
    getPreviousInvoice,
    client: { hasNextPage, fetchNextPage },
  } = useInvoiceSearchQuery({ doNotSetLastFilter: true, filters: lastFilter ?? new Map() });

  const indexInInvoice = getIndexById(currentInvoiceId);

  const isNextDisabled = !(indexInInvoice < allInvoices.length - 1);
  const isPreviousDisabled = indexInInvoice === 0;

  // check if we are 2 invoices back of the invoice list, if so we will get the next set of invoice if possible.
  useEffect(() => {
    if (indexInInvoice >= allInvoices.length - 2 && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, indexInInvoice, allInvoices.length, fetchNextPage]);

  const onNextPress = () => {
    const nextInvoice = getNextInvoice(currentInvoiceId);
    if (nextInvoice) {
      navigateToInvoice(nextInvoice.id, { animationType: 'next' });
    }
  };

  const onPreviousPress = () => {
    const previousInvoice = getPreviousInvoice(currentInvoiceId);
    if (previousInvoice) {
      navigateToInvoice(previousInvoice.id, { animationType: 'previous' });
    }
  };

  return (
    <Box borderBottom={1} borderColor={borderColor} borderTop={isIOS ? 1 : 0} style={stylesheet.itemsFlexRow}>
      <Box borderColor={borderColor} borderRight={1} px={12} style={stylesheet.itemFlex1}>
        <Button
          iconLeft={ArrowLeftIcon}
          isDisabled={isDisabled || isPreviousDisabled}
          size="S"
          textAlign="left"
          title={t('invoice_details.previous_button')}
          variant={isPreviousDisabled ? 'greyClear' : 'secondaryClear'}
          onPress={onPreviousPress}
        />
      </Box>
      <Box px={12} style={stylesheet.itemFlex1}>
        <Button
          iconRight={ArrowRightIcon}
          isDisabled={isDisabled || isNextDisabled}
          size="S"
          textAlign="right"
          title={t('invoice_details.next_button')}
          variant={isNextDisabled ? 'greyClear' : 'secondaryClear'}
          onPress={onNextPress}
        />
      </Box>
    </Box>
  );
};

const stylesheet = StyleSheet.create({
  itemFlex1: {
    flex: 1,
  },
  itemsFlexRow: {
    flexDirection: 'row',
  },
});
