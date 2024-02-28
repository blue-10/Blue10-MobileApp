import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';

import ArrowLeftIcon from '../../../assets/icons/arrow-round-left.svg';
import ArrowRightIcon from '../../../assets/icons/arrow-round-right.svg';
import { useInvoiceToDoQuery } from '../../hooks/queries/useInvoiceToDoQuery';
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
  const navigation = useNavigation();

  const {
    all: allInvoices,
    getIndexById,
    client: { hasNextPage, fetchNextPage },
  } = useInvoiceToDoQuery();

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
    if (!(indexInInvoice < allInvoices.length - 1)) {
      return;
    }
    const nextInvoice = allInvoices[indexInInvoice + 1];
    // @ts-ignore
    navigation.replace('InvoiceDetailsScreen', {
      disabledAnimation: true,
      id: nextInvoice.id,
    });
  };

  const onPreviousPress = () => {
    if (indexInInvoice < 1) {
      return;
    }

    const prevInvoice = allInvoices[indexInInvoice - 1];
    // @ts-ignore
    navigation.replace('InvoiceDetailsScreen', {
      disabledAnimation: true,
      id: prevInvoice.id,
    });
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
