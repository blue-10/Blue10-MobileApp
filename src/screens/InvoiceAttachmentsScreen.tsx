import { useQuery } from '@tanstack/react-query';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import type { ListRenderItem } from 'react-native';
import { Alert, FlatList, RefreshControl, View } from 'react-native';

import { FetchErrorMessage } from '../components/FetchErrorMessage/FetchErrorMessage';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import { normalizeInvoiceAttachmentFromResponseItem } from '../entity/invoice/normalizer';
import type { InvoiceAttachment } from '../entity/invoice/types';
import { useApi } from '../hooks/useApi';
import { colors } from '../theme';
import { normalizeMap } from '../utils/normalizerUtils';
import { useQueryKeySuffix } from '../utils/queryUtils';

type Props = {
  id: string;
};

export const InvoiceAttachmentsScreen: React.FC<Props> = ({ id }) => {
  const api = useApi();

  const {
    data: invoiceAttachments = [],
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryFn: async () => normalizeMap(await api.invoice.getAttachments(id), normalizeInvoiceAttachmentFromResponseItem),
    queryKey: useQueryKeySuffix([queryKeys.invoiceAttachments, id]),
  });

  const renderItem: ListRenderItem<InvoiceAttachment> = useCallback(
    ({ item, index }) => (
      <ListItem
        isEven={index % 2 === 0}
        title={item.filename}
        onPress={() => {
          Alert.alert('TODO', 'Download of item is not yet implemented!');
        }}
      />
    ),
    [],
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        colors={[colors.primary]} // android
        refreshing={isFetching}
        tintColor={colors.primary} // ios
        onRefresh={() => refetch()}
      />
    ),
    [isFetching, refetch],
  );

  return (
    <View style={{ flex: 1 }}>
      <FetchErrorMessage isError={isError} onRetry={() => refetch()}>
        <FlatList<InvoiceAttachment>
          data={invoiceAttachments}
          ItemSeparatorComponent={ListSeparator}
          keyExtractor={(item) => item.id}
          refreshControl={refreshControl}
          renderItem={renderItem}
          style={{ minHeight: 90 }}
        />
      </FetchErrorMessage>
    </View>
  );
};
