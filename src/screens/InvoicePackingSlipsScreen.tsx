import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { Alert, FlatList, ListRenderItem, RefreshControl, View } from 'react-native';

import { FetchErrorMessage } from '../components/FetchErrorMessage/FetchErrorMessage';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import { normalizeInvoicePackingSlipFromResponse } from '../entity/invoice/normalizer';
import { InvoicePackingSlip } from '../entity/invoice/types';
import { useApi } from '../hooks/useApi';
import { colors } from '../theme';
import { normalizeMap } from '../utils/normalizerUtils';

type Props = {
  id: string;
}

export const InvoicePackingSlipsScreen: React.FC<Props> = ({ id }) => {
  const api = useApi();

  const {
    data: users = [],
    isFetching,
    isError,
    refetch,
  } = useQuery(
    [queryKeys.invoicePackingSlips, id],
    async () => normalizeMap(
      await api.invoice.getPackingSlips(id),
      normalizeInvoicePackingSlipFromResponse,
    ),
  );
  const renderItem: ListRenderItem<InvoicePackingSlip> = useCallback(({ item, index }) => (
    <ListItem
      isEven={(index % 2 === 0)}
      title={[item.relationCode, item.relationName].join(' ')}
      onPress={() => {
        Alert.alert('TODO', 'Add some action for listitem');
      }}
    />
  ), []);

  return (
    <View style={{ flex: 1 }}>
      <FetchErrorMessage
        isError={isError}
        onRetry={() => refetch()}
      >
        <FlatList<InvoicePackingSlip>
          style={{ minHeight: 90 }}
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ListSeparator}
          refreshControl={(
            <RefreshControl
              colors={[colors.primary]} // android
              tintColor={colors.primary} // ios
              refreshing={isFetching}
              onRefresh={() => refetch()}
            />)}
        />
      </FetchErrorMessage>
    </View>
  );
};
