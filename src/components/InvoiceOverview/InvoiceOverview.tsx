import { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import type { InvoiceListItem } from '@/entity/invoice/types';
import { colors } from '@/theme';

import { InvoiceToDoListItem } from '../InvoiceToDoListItem/InvoiceToDoListItem';
import { ListFooterSpinner } from '../ListFooterSpinner/ListFooterSpinner';
import { ListSeparator } from '../ListSeparator/ListSeparator';

export type InvoiceOverviewItems = InvoiceListItem[];

type Props = {
  items: InvoiceOverviewItems;
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  onItemPress: (item: InvoiceListItem) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
};

export const InvoiceOverview: React.FC<Props> = ({
  items,
  isFetching,
  isFetchingNextPage,
  onItemPress,
  onRefresh,
  onLoadMore,
}) => {
  const refreshControl = useMemo(
    () => (
      <RefreshControl
        colors={[colors.primary]} // android
        refreshing={isFetching && !isFetchingNextPage}
        tintColor={colors.primary} // ios
        onRefresh={() => onRefresh()}
      />
    ),
    [isFetching, isFetchingNextPage, onRefresh],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: InvoiceListItem; index: number }) => {
      return <InvoiceToDoListItem index={index} item={item} onPress={() => onItemPress(item)} />;
    },
    [onItemPress],
  );

  return (
    <FlatList<InvoiceListItem>
      data={items}
      ItemSeparatorComponent={ListSeparator}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={View}
      ListFooterComponent={isFetchingNextPage ? ListFooterSpinner : null}
      refreshControl={refreshControl}
      renderItem={renderItem}
      style={{ minHeight: 90 }} // without height the refresh indicator is not visible during reload
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
    />
  );
};
