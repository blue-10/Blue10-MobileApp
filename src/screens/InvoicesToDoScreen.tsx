import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, View } from 'react-native';

import { InvoiceToDoListItem } from '../components/InvoiceToDoListItem/InvoiceToDoListItem';
import { ListFooterSpinner } from '../components/ListFooterSpinner/ListFooterSpinner';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { TopBarWithSubTitle } from '../components/TopBarWithSubTitle/TopBarWithSubTitle';
import { queryKeys } from '../constants';
import type { InvoiceListItem } from '../entity/invoice/types';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';
import { useInvoiceToDoQuery } from '../hooks/queries/useInvoiceToDoQuery';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

export type InvoicesToDoScreenProps = NativeStackScreenProps<RootStackParamList, 'InvoicesToDoScreen'>;

export const InvoicesToDoScreen: React.FC<InvoicesToDoScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const [totalInvoices, setTotalInvoices] = useState<number>(route.params?.invoices ?? 0);
  const currentUser = useGetCurrentUser();

  // region update screen top bar subtitle
  useEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (
        <TopBarWithSubTitle
          subTitle={t('to_do_invoices.count_results_header', {
            count: totalInvoices,
          })}
          title={props.children}
        />
      ),
    });
  }, [totalInvoices, navigation, t]);
  // endregion

  const {
    all,
    client: { hasNextPage, isFetching, isFetchingNextPage, fetchNextPage },
  } = useInvoiceToDoQuery();

  // region update subtitle total records when data has changed
  useEffect(() => {
    const totalCount = all.length === 0 ? 0 : all[0].totalCount || 0;

    setTotalInvoices((value) => (value !== totalCount ? totalCount : value));
  }, [all]);
  // endregion

  // load more
  const loadMore = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage().then();
    }
  }, [hasNextPage, fetchNextPage]);

  // region render methods
  const renderItem = useCallback(
    ({ item, index }: { item: InvoiceListItem; index: number }) => {
      return (
        <InvoiceToDoListItem
          index={index}
          item={item}
          onPress={() => {
            navigation.navigate('InvoiceDetailsScreen', { id: item.id });
          }}
        />
      );
    },
    [navigation],
  );
  // endregion

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        colors={[colors.primary]} // android
        refreshing={isFetching && !isFetchingNextPage}
        tintColor={colors.primary} // ios
        onRefresh={() => {
          // we reset the query cache of the paging else if the user has scrolled to 1000's of pages
          // it will get them all of them one by one again.
          queryClient.resetQueries({
            queryKey: [
              queryKeys.invoicesToDo,
              `user-${currentUser.currentUser?.Id}`,
              `belongs-to-${currentUser.currentUser?.BelongsTo}`,
            ],
          });
        }}
      />
    ),
    [currentUser.currentUser?.BelongsTo, currentUser.currentUser?.Id, isFetching, isFetchingNextPage, queryClient],
  );

  return (
    <View>
      <StatusBar animated style="dark" />
      <FlatList<InvoiceListItem>
        data={all}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={View}
        ListFooterComponent={isFetchingNextPage ? ListFooterSpinner : null}
        refreshControl={refreshControl}
        renderItem={renderItem}
        style={{ minHeight: 90 }} // without height the refresh indicator is not visible during reload
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};
