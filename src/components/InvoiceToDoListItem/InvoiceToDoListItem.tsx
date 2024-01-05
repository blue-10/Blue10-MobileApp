import format from 'date-fns/format';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { InvoiceListItem } from '../../entity/invoice/types';
import { colors, dimensions } from '../../theme';
import { numberToCurrency } from '../../utils/numberToCurrency';

type Props = {
  item: InvoiceListItem;
  onPress: () => void;
  index: number;
}

export const InvoiceToDoListItem: React.FC<Props> = (
  {
    item,
    index,
    onPress,
  }) => {
  return (
    <TouchableHighlight
      underlayColor={colors.primary}
      style={[styles.container, index % 2 === 0 ? styles.even : styles.odd]}
      onPress={onPress}
    >
      <>
        <View style={styles.row}>
          <Text style={styles.companyNameText}>
            {item.companyName}
          </Text>
          <Text style={styles.invoiceAmountText}>
            {numberToCurrency(item.price, item.currency)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.invoiceNumberText}>
            {item.invoiceNumber}
          </Text>
          <Text style={styles.invoiceDateText}>
            {item.date && format(item.date, 'dd MM Y')}
          </Text>
        </View>
      </>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  companyNameText: {
    color: colors.list.text.primary,
    flex: 1,
    fontSize: dimensions.fontSizes.medium,
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 0,
    paddingHorizontal: dimensions.spacing.normal,
    paddingVertical: dimensions.spacing.narrow,
  },

  even: {
    backgroundColor: colors.list.even.background,
  },
  invoiceAmountText: {
    color: colors.list.text.primary,
    flex: 1,
    fontSize: dimensions.fontSizes.medium,
    textAlign: 'right',
  },

  invoiceDateText: {
    color: colors.list.text.secondary,
    flex: 1,
    fontSize: dimensions.fontSizes.normal,
    textAlign: 'right',
  },
  invoiceNumberText: {
    color: colors.list.text.secondary,
    flex: 1,
    fontSize: dimensions.fontSizes.normal,
  },
  odd: {
    backgroundColor: colors.list.odd.background,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});
