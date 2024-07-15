import type { StackScreenProps } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import type { ListRenderItem } from 'react-native';
import { FlatList, RefreshControl, View } from 'react-native';

import { FetchErrorMessage } from '../components/FetchErrorMessage/FetchErrorMessage';
import { InvoiceBookingItem } from '../components/InvoiceBookingItem/InvoiceBookingItem';
import { ListHeaderLastUpdatedAt } from '../components/ListHeaderLastUpdatedAt/ListHeaderLastUpdatedAt';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import { normalizeInvoiceLineFromResponse } from '../entity/invoice/normalizer';
import type { InvoiceLine } from '../entity/invoice/types';
import { useInvoiceDetails } from '../hooks/queries/useInvoiceDetails';
import { useApi } from '../hooks/useApi';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { normalizeMap } from '../utils/normalizerUtils';
import { useQueryKeySuffix } from '../utils/queryUtils';

type Props = StackScreenProps<RootStackParamList, 'InvoiceBookingsScreen'>;

export const InvoiceBookingsScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const api = useApi();
  const { data: invoice, isFetching: isFetchingInvoice } = useInvoiceDetails(id);

  const {
    data: users = [],
    isFetching,
    refetch,
    isError,
    dataUpdatedAt,
  } = useQuery({
    enabled: !!invoice,
    queryFn: async () =>
      normalizeMap(await api.invoice.getInvoiceLines(id, invoice?.companyId ?? ''), normalizeInvoiceLineFromResponse),
    queryKey: useQueryKeySuffix([queryKeys.invoiceBookings]),
  });
  const renderItem: ListRenderItem<InvoiceLine> = useCallback(
    ({ item, index }) => <InvoiceBookingItem isEven={index % 2 === 0} item={item} />,
    [],
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        colors={[colors.primary]} // android
        refreshing={isFetching || isFetchingInvoice}
        tintColor={colors.primary} // ios
        onRefresh={() => refetch()}
      />
    ),
    [isFetching, isFetchingInvoice, refetch],
  );

  return (
    <View style={{ flex: 1 }}>
      <FetchErrorMessage isError={isError} onRetry={() => refetch()}>
        <FlatList<InvoiceLine>
          data={users}
          ItemSeparatorComponent={ListSeparator}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => <ListHeaderLastUpdatedAt lastUpdatedAt={dataUpdatedAt} />}
          refreshControl={refreshControl}
          renderItem={renderItem}
          style={{ minHeight: 90 }}
        />
      </FetchErrorMessage>
    </View>
  );
};
