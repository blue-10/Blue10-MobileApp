import React, { useCallback, useMemo } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Pdf from 'react-native-pdf';

import Box from '../components/Box/Box';
import Button from '../components/Button/Button';
import { FetchErrorMessage } from '../components/FetchErrorMessage/FetchErrorMessage';
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

  const {
    invoiceAttachments = [],
    isFetching,
    isError,
    refetch,
  } = useInvoiceAttachments(id);  

  const firstAttachmentId = invoiceAttachments?.[0]?.id;

  const { fileDataUri } = useInvoiceAttachmentImage(
    firstAttachmentId ?? '',
    1,
    invoiceAttachments.length === 1
  );

  const renderItem = useCallback(
    ({ item, index }: { item: InvoiceAttachment; index: number }) => (
      <ListItem
        isEven={index % 2 === 0}
        title={item.filename}
        onPress={() => {}}
      />
    ),
    []
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
    [isFetching, refetch]
  );

  const hasSingleAttachment = invoiceAttachments.length === 1;

  return (
    <View style={styles.container}>
      <FetchErrorMessage isError={isError} onRetry={refetch}>
        {!hasSingleAttachment ? (
           <FlatList<InvoiceAttachment>
            data={invoiceAttachments}
            ItemSeparatorComponent={ListSeparator}
            keyExtractor={(item) => item.id}
            refreshControl={refreshControl}
            renderItem={renderItem}
          />
          
        ) : (         
          <View style={styles.pdfContainer}>
            <Pdf source={{ uri: fileDataUri }} style={styles.pdf} />
          </View>
        )}

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

  pdfContainer: {
    flex: 1,
  },

  pdf: {
    flex: 1,
  },
});