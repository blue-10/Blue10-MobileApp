import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ListRenderItem } from 'react-native';
import { FlatList, RefreshControl, View } from 'react-native';

import Box from '../components/Box/Box';
import Button from '../components/Button/Button';
import { FetchErrorMessage } from '../components/FetchErrorMessage/FetchErrorMessage';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import { normalizeInvoiceAttachmentFromResponseItem } from '../entity/invoice/normalizer';
import type { InvoiceAttachment } from '../entity/invoice/types';
import { useApi } from '../hooks/useApi';
import { useImageStore } from '../store/ImageStore';
import { colors } from '../theme';
import { normalizeMap } from '../utils/normalizerUtils';
import { useQueryKeySuffix } from '../utils/queryUtils';
import type { InvoiceOriginalsScreenProps } from './InvoiceOriginalsScreen';

type Props = {
  id: string;
  navigation: InvoiceOriginalsScreenProps['navigation'];
};

export const InvoiceAttachmentsScreen: React.FC<Props> = ({ navigation, id }) => {
  const api = useApi();
  const { t } = useTranslation();
  const { reset } = useImageStore();

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
          // noop
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
      <Box borderColor={colors.borderColor} borderTop={1} px={26} py={32} style={{ alignItems: 'flex-end' }}>
        <Button
          size="M"
          style={{ maxWidth: 153 }}
          title={t('invoice_attachments.add_button')}
          variant="secondary"
          onPress={() => {
            reset();
            navigation.navigate('InvoiceAttachmentAddScreen', { id });
          }}
        />
      </Box>
    </View>
  );
};
