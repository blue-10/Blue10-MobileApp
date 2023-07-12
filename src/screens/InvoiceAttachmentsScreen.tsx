import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { Alert, FlatList, ListRenderItem, RefreshControl, View } from 'react-native';

import { FetchErrorMessage } from '../components/FetchErrorMessage/FetchErrorMessage';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import { normalizeInvoiceAttachmentFromResponseItem } from '../entity/invoice/normalizer';
import { InvoiceAttachment } from '../entity/invoice/types';
import { useApi } from '../hooks/useApi';
import { colors } from '../theme';
import { normalizeMap } from '../utils/normalizerUtils';
import { useQueryKeySuffix } from '../utils/queryUtils';

type Props = {
  id: string;
}

export const InvoiceAttachmentsScreen: React.FC<Props> = ({ id }) => {
  const api = useApi();

  const {
    data: invoiceAttachments = [],
    isFetching,
    isError,
    refetch,
  } = useQuery(
    useQueryKeySuffix([queryKeys.invoiceAttachments, id]),
    async () => normalizeMap(
      await api.invoice.getAttachments(id),
      normalizeInvoiceAttachmentFromResponseItem,
    ),
  );

  const renderItem: ListRenderItem<InvoiceAttachment> = useCallback(({ item, index }) => (
    <ListItem
      isEven={(index % 2 === 0)}
      title={item.filename}
      onPress={() => {
        Alert.alert('TODO', 'Download of item is not yet implemented!');
      }}
    />
  ), []);

  return (
    <View style={{ flex: 1 }}>
      <FetchErrorMessage
        isError={isError}
        onRetry={() => refetch()}
      >
        <FlatList<InvoiceAttachment>
          style={{ minHeight: 90 }}
          data={invoiceAttachments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ListSeparator}
          refreshControl={(
            <RefreshControl
              colors={[colors.primary]} // android
              tintColor={colors.primary} // ios
              refreshing={isFetching}
              onRefresh={() => refetch()}
            />
          )}
        />
      </FetchErrorMessage>
    </View>
  );
};
