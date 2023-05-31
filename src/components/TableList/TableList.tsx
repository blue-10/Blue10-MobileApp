import React from 'react';
import { StyleSheet, View } from 'react-native';

import Text, { TextPropsWithStyle } from '../Text/Text';

export type TableListItem = {
  label: string;
  value: string;
};

type TableListProps = {
  items: TableListItem[];
  labelTextProps?: Partial<TextPropsWithStyle>;
  valueTextProps?: Partial<TextPropsWithStyle>;
}

export const TableList: React.FC<TableListProps> = ({ items, labelTextProps, valueTextProps }) => (
  <View style={styles.tableListContainer}>
    {items.map((item) => (
      <View style={styles.tableListItem} key={`table_list_item_${item.label}`}>
        <View style={styles.tableListItemLabel}>
          <Text variant="bodyRegular" {...labelTextProps}>{item.label}</Text>
        </View>
        <View style={styles.tableListItemValue}>
          <Text variant="bodyRegular" {...valueTextProps}>{item.value}</Text>
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
