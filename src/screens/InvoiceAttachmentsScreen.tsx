import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Pdf from 'react-native-pdf';

import Box from '../components/Box/Box';
import Button from '../components/Button/Button';
import { FetchErrorMessage } from '../components/FetchErrorMessage/FetchErrorMessage';
import { ImageZoomPan } from '@/components/ImageZoomPan/ImageZoomPan';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';

import { useInvoiceAttachments } from '@/hooks/queries/useInvoiceAttachments';
import { useInvoiceAttachmentImage } from '@/hooks/queries/useInvoiceAttachmentImage';

import { useImageStore } from '../store/ImageStore';
import { colors } from '../theme';

import type { InvoiceAttachment } from '../entity/invoice/types';
import type { InvoiceOriginalsScreenProps } from './InvoiceOriginalsScreen';

type Props = {
  id: string;
  navigation: InvoiceOriginalsScreenProps['navigation'];
};

export const InvoiceAttachmentsScreen: React.FC<Props> = ({ navigation, id }) => {
  const { t } = useTranslation();
  const { reset } = useImageStore();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const {
    invoiceAttachments = [],
    isFetching,
    isError,
    refetch,
  } = useInvoiceAttachments(id);

  useEffect(() => {
    if (invoiceAttachments.length > 0 && !selectedId) {
      setSelectedId(invoiceAttachments[0].id);
    }
  }, [invoiceAttachments]);

  const { fileDataUri, query: imageQuery } = useInvoiceAttachmentImage(
    selectedId ?? '',
    1,
    !!selectedId,
  );

  const isPdf = fileDataUri?.startsWith('data:application/pdf');

  const renderItem = useCallback(
    ({ item, index }: { item: InvoiceAttachment; index: number }) => (
      <ListItem
        isChecked={item.id === selectedId}
        isEven={index % 2 === 0}
        title={item.filename}
        variant="checkbox"
        onPress={() => setSelectedId(item.id)}
      />
    ),
    [selectedId],
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        colors={[colors.primary]}
        refreshing={isFetching}
        tintColor={colors.primary}
        onRefresh={refetch}
      />
    ),
    [isFetching, refetch],
  );

  return (
    <View style={styles.container}>
      <FetchErrorMessage isError={isError} onRetry={refetch}>
        <View style={styles.list}>
          <FlatList<InvoiceAttachment>
            data={invoiceAttachments}
            ItemSeparatorComponent={ListSeparator}
            keyExtractor={(item) => item.id}
            refreshControl={refreshControl}
            renderItem={renderItem}
          />
        </View>
        <View style={styles.viewer}>
          {imageQuery.isFetching ? (
            <ActivityIndicator color={colors.primary} size="large" />
          ) : fileDataUri ? (
            isPdf ? (
              <Pdf source={{ uri: fileDataUri }} style={styles.fill} />
            ) : (
              <ImageZoomPan source={{ uri: fileDataUri }} style={styles.fill} />
            )
          ) : null}
        </View>
      </FetchErrorMessage>

      <Box
        borderColor={colors.borderColor}
        borderTop={1}
        px={26}
        py={32}
        style={{ alignItems: 'flex-end' }}
      >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  viewer: {
    alignItems: 'center',
    borderColor: colors.borderColor,
    borderTopWidth: 1,
    flex: 3,
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});
