import type { StackScreenProps } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { InvoiceOverview } from '@/components/InvoiceOverview/InvoiceOverview';

import { TopBarWithSubTitle } from '../components/TopBarWithSubTitle/TopBarWithSubTitle';
import { queryKeys } from '../constants';
import { useInvoiceToDoQuery } from '../hooks/queries/useInvoiceToDoQuery';
import type { RootStackParamList } from '../navigation/types';
import { useIsFocused } from '@react-navigation/native';

export type InvoicesToDoScreenProps = StackScreenProps<RootStackParamList, 'InvoicesToDoScreen'>;

export const InvoicesToDoScreen: React.FC<InvoicesToDoScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const [totalInvoices, setTotalInvoices] = useState<number>(route.params?.invoices ?? 0);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {      
      refetch();
    }
  }, [isFocused]);


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
    client: { hasNextPage, isFetching, isFetchingNextPage, isError, fetchNextPage, refetch },
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

  const refresh = useCallback(() => {
    queryClient.resetQueries({
      queryKey: [queryKeys.invoiceResults],
    });
  }, [queryClient]);
  // endregion

  return (
    <View style={{ flex: 1 }}>
      <StatusBar animated style="dark" />
      <InvoiceOverview
        hasNextPage={hasNextPage}
        isError={isError}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        items={all}
        onItemPress={(item) => navigation.navigate('InvoiceDetailsScreen', { id: item.id })}
        onLoadMore={loadMore}
        onRefresh={refresh}
        onRetry={refetch}
      />
    </View>
  );
};
