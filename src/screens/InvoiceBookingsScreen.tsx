import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, RefreshControl, View } from 'react-native';

import { FetchErrorMessage } from '../components/FetchErrorMessage/FetchErrorMessage';
import { InvoiceBookingItem } from '../components/InvoiceBookingItem/InvoiceBookingItem';
import { ListHeaderLastUpdatedAt } from '../components/ListHeaderLastUpdatedAt/ListHeaderLastUpdatedAt';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import { normalizeInvoiceLineFromResponse } from '../entity/invoice/normalizer';
import { InvoiceLine } from '../entity/invoice/types';
import { useInvoiceDetails } from '../hooks/queries/useInvoiceDetails';
import { useApi } from '../hooks/useApi';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { normalizeMap } from '../utils/normalizerUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceBookingsScreen'>;

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
  } = useQuery(
    [queryKeys.invoiceBookings],
    async () =>
      normalizeMap(
        await api.invoice.getInvoiceLines(id, invoice?.companyId ?? ''),
        normalizeInvoiceLineFromResponse,
      ),
    {
      enabled: !!invoice,
    },
  );
  const renderItem: ListRenderItem<InvoiceLine> = useCallback(({ item, index }) => (
    <InvoiceBookingItem
      isEven={(index % 2 === 0)}
      item={item}
    />
  ), []);

  return (
    <View style={{ flex: 1 }}>
      <FetchErrorMessage
        isError={isError}
        onRetry={() => refetch()}
      >
        <FlatList<InvoiceLine>
          style={{ minHeight: 90 }}
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ListSeparator}
          refreshControl={(
            <RefreshControl
              colors={[colors.primary]} // android
              tintColor={colors.primary} // ios
              refreshing={isFetching || isFetchingInvoice}
              onRefresh={() => refetch()}
            />)}
          ListHeaderComponent={() => (<ListHeaderLastUpdatedAt lastUpdatedAt={dataUpdatedAt} />)}
        />
      </FetchErrorMessage>
    </View>
  );
};
