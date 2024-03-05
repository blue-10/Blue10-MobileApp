import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { InvoiceOverview } from '@/components/InvoiceOverview/InvoiceOverview';
import { queryKeys } from '@/constants';
import { useInvoiceSearchQuery } from '@/hooks/queries/useInvoiceSearchQuery';
import type { RootStackParamList } from '@/navigation/types';
import { useSearchFilterStore } from '@/store/SearchFilterStore';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchResultsScreen'>;

export const SearchResultsScreen: React.FC<Props> = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { filters } = useSearchFilterStore();
  const { t } = useTranslation();
  const {
    all,
    client: { hasNextPage, isFetching, isFetchingNextPage, fetchNextPage },
  } = useInvoiceSearchQuery({ filters });

  const totalResults = useMemo(() => {
    return all.length === 0 ? 0 : all[0].totalCount || 0;
  }, [all]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('to_do_invoices.count_results_header', {
        count: totalResults,
      }),
    });
  });

  const loadMore = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage().then();
    }
  }, [hasNextPage, fetchNextPage]);

  const refresh = useCallback(() => {
    queryClient.resetQueries({
      queryKey: [queryKeys.invoiceResults],
    });
  }, [queryClient]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar animated style="dark" />
      <InvoiceOverview
        hasNextPage={hasNextPage}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        items={all}
        onItemPress={(item) => navigation.navigate('InvoiceDetailsScreen', { id: item.id })}
        onLoadMore={loadMore}
        onRefresh={refresh}
      />
    </View>
  );
};
