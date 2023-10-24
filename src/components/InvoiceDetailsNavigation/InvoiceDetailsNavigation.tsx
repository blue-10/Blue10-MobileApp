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
}

const borderColor = colors.borderColor;

export const InvoiceDetailsNavigation: React.FC<Props> = (
  {
    currentInvoiceId,
    isDisabled = false,
  },
) => {
  const isIOS = Platform.OS === 'ios';
  const { t } = useTranslation();
  const navigation = useNavigation();

  const {
    all: allInvoices,
    getIndexById,
    client: {
      hasNextPage,
      fetchNextPage,
    },
  } = useInvoiceToDoQuery();

  const indexInInvoice = getIndexById(currentInvoiceId);

  const isNextDisabled = !(indexInInvoice < (allInvoices.length - 1));
  const isPreviousDisabled = indexInInvoice === 0;

  // check if we are 2 invoices back of the invoice list, if so we will get the next set of invoice if possible.
  useEffect(() => {
    if (indexInInvoice >= (allInvoices.length - 2) && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, indexInInvoice, allInvoices.length, fetchNextPage]);

  const onNextPress = () => {
    if (!(indexInInvoice < (allInvoices.length - 1))) {
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
    <Box borderColor={borderColor} borderBottom={1} style={stylesheet.itemsFlexRow} borderTop={isIOS ? 1 : 0}>
      <Box borderColor={borderColor} borderRight={1} px={12} style={stylesheet.itemFlex1}>
        <Button
          size="S"
          variant={isPreviousDisabled ? 'greyClear' : 'secondaryClear'}
          iconLeft={ArrowLeftIcon}
          title={t('invoice_details.previous_button')}
          textAlign="left"
          isDisabled={isDisabled || isPreviousDisabled}
          onPress={onPreviousPress}
        />
      </Box>
      <Box style={stylesheet.itemFlex1} px={12}>
        <Button
          size="S"
          variant={isNextDisabled ? 'greyClear' : 'secondaryClear'}
          iconRight={ArrowRightIcon}
          title={t('invoice_details.next_button')}
          textAlign="right"
          isDisabled={isDisabled || isNextDisabled}
          onPress={onNextPress}
        />
      </Box>
    </Box>
  );
};

const stylesheet = StyleSheet.create(
  {
    itemFlex1: {
      flex: 1,
    },
    itemsFlexRow: {
      flexDirection: 'row',
    },
  },
);
