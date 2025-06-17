import React from 'react';
import type { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import type { TextPropsWithStyle } from '../Text/Text';
import Text from '../Text/Text';

export type TableListItem = {
  label: ReturnType<ReturnType<typeof useTranslation>['t']> | string;
  value: ReturnType<ReturnType<typeof useTranslation>['t']> | string;
};

type TableListProps = {
  items: TableListItem[];
  labelTextProps?: Partial<TextPropsWithStyle>;
  valueTextProps?: Partial<TextPropsWithStyle>;
};

export const TableList: React.FC<TableListProps> = ({ items, labelTextProps, valueTextProps }) => (
  <View style={styles.tableListContainer}>
    {items.map((item) => (
      <View key={`table_list_item_${item.label}`} style={styles.tableListItem}>
        <View style={styles.tableListItemLabel}>
          <Text variant="bodyRegular" {...labelTextProps}>
            {item.label}
          </Text>
        </View>
        <View style={styles.tableListItemValue}>
          <Text variant="bodyRegular" {...valueTextProps}>
            {item.value}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  tableListContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  tableListItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  tableListItemLabel: {
    width: '50%',
  },
  tableListItemValue: {
    width: '50%',
  },
});
