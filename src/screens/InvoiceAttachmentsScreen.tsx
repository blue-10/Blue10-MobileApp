import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { Alert, FlatList, ListRenderItem, RefreshControl, View } from 'react-native';

import { getInvoiceAttachments } from '../api/api';
import { InvoiceAttachment } from '../api/types';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import i18n, { translationKeys } from '../i18n/i18n';
import { useAuthStore } from '../store/AuthStore';
import { colors } from '../theme';
import { humanFileSize } from '../utils/humanFileSize';

type Props = {
  id: string;
}

export const InvoiceAttachmentsScreen: React.FC<Props> = ({ id }) => {
  const { token, environmentId } = useAuthStore(({ token, environmentId }) => ({ environmentId, token }));

  const {
    data: invoiceAttachments = [],
    isFetching,
    refetch,
  } = useQuery(
    [queryKeys.invoiceAttachments, environmentId],
    () => getInvoiceAttachments(token ?? 'xxx', environmentId ?? 'xxx', id),
  );
  const renderItem: ListRenderItem<InvoiceAttachment> = useCallback(({ item, index }) => (
    <ListItem
      isEven={(index % 2 === 0)}
      title={item.name}
      subTitle={i18n.translate(
        translationKeys.invoice_originals.file_size, {
          size: humanFileSize(item.fileSize),
        })}
      onPress={() => {
        Alert.alert('TODO', 'Add some action for listitem');
      }}
    />
  ), []);

  return (
    <View style={{ flex: 1 }}>
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
    </View>
  );
};
