import { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import type { InvoiceListItem } from '@/entity/invoice/types';
import { colors } from '@/theme';

import { FetchErrorMessage } from '../FetchErrorMessage/FetchErrorMessage';
import { InvoiceToDoListItem } from '../InvoiceToDoListItem/InvoiceToDoListItem';
import { ListFooterSpinner } from '../ListFooterSpinner/ListFooterSpinner';
import { ListSeparator } from '../ListSeparator/ListSeparator';
import { ListViewEmpty } from '../ListViewEmpty/ListViewEmpty';

export type InvoiceOverviewItems = InvoiceListItem[];

type Props = {
  items: InvoiceOverviewItems;
  hasNextPage: boolean;
  isError: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  onItemPress: (item: InvoiceListItem) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
};

export const InvoiceOverview: React.FC<Props> = ({
  items,
  isError,
  isFetching,
  isFetchingNextPage,
  onItemPress,
  onRefresh,
  onLoadMore,
  onRetry,
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
    <FetchErrorMessage isError={isError} onRetry={onRetry}>
      <FlatList<InvoiceListItem>
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={items}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<ListViewEmpty isFetching={isFetching} />}
        ListFooterComponent={isFetchingNextPage ? ListFooterSpinner : null}
        refreshControl={refreshControl}
        renderItem={renderItem}
        style={{ minHeight: 90 }} // without height the refresh indicator is not visible during reload
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />
    </FetchErrorMessage>
  );
};
