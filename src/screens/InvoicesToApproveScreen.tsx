import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StatusBar, View } from 'react-native';

import { getInvoicesToApprove } from '../api/api';
import { InvoiceToApprove } from '../api/types';
import { InvoiceToApproveListItem } from '../components/InvoiceToApproveListItem/InvoiceToApproveListItem';
import { ListFooterSpinner } from '../components/ListFooterSpinner/ListFooterSpinner';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { TopBarWithSubTitle } from '../components/TopBarWithSubTitle/TopBarWithSubTitle';
import { queryKeys } from '../constants';
import i18n, { translationKeys } from '../i18n/i18n';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/AuthStore';
import { getRefreshControl } from '../utils/refreshControl';

type Props = NativeStackScreenProps<RootStackParamList, 'InvoicesToApproveScreen'>;

export const InvoicesToApproveScreen: React.FC<Props> = (
  {
    navigation,
    route,
  }) => {
  const queryClient = useQueryClient();
  const { token, environmentId } = useAuthStore(({ token, environmentId }) => ({ environmentId, token }));
  const [totalInvoices, setTotalInvoices] = useState<number>(route.params?.invoices ?? 0);

  // region update screen top bar subtitle
  useEffect(
    () => {
      navigation.setOptions(
        {
          headerTitle: (props) => (
            <TopBarWithSubTitle
              title={props.children}
              subTitle={i18n.translate(
                translationKeys.to_approved_invoices.count_results_header,
                { count: totalInvoices },
              )}
            />
          ),
        },
      );
    },
    [totalInvoices, navigation],
  );
  // endregion

  // region react query
  const fetchInvoiceToApprove = useCallback(
    ({ pageParam = 1 }) =>
      getInvoicesToApprove(
        token ?? 'xxx',
        environmentId ?? 'xxx',
        pageParam,
      ),
    [environmentId, token],
  );

  const {
    isLoading,
    error,
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    [queryKeys.invoicesToApprove, environmentId],
    fetchInvoiceToApprove,
    {
      getNextPageParam: (lastPage) => lastPage.paging.next,
      getPreviousPageParam: (firstPage) => firstPage.paging.previous,
    },
  );
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  // endregion

  // region update subtitle total records when data has changed
  useEffect(
    () => {
      const newTotalInvoices = data?.pages[0].paging.totalResults;
      if (newTotalInvoices) {
        setTotalInvoices(newTotalInvoices);
      }
    },
    [data],
  );
  // endregion

  // normalize items to single array
  const all = useMemo(() => data ? data.pages.flatMap((page) => page.invoices) : [],
    [data],
  );

  // load more
  const loadMore = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage().then();
    }
  },
  [
    hasNextPage,
    fetchNextPage,
  ],
  );

  // region render methods
  const renderItem = useCallback(({ item, index }: { item: InvoiceToApprove; index: number }) => (
    <InvoiceToApproveListItem
      item={item}
      index={index}
      onPress={() => {
        navigation.navigate('InvoiceDetailsScreen', { id: item.id });
      }}
    />
  ), [navigation]);
    // endregion

  return (
    <View>
      <StatusBar barStyle="default" animated />
      <FlatList<InvoiceToApprove>
        style={{ minHeight: 90 }} // without height the refresh indicator is not visible during reload
        data={all}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ListSeparator}
        ListEmptyComponent={View}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? ListFooterSpinner : null}
        refreshControl={getRefreshControl(queryClient, [queryKeys.invoicesToApprove], isLoading)}
      />
    </View>
  );
};
