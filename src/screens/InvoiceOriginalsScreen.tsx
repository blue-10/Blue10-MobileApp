import SegmentedControl from '@react-native-segmented-control/segmented-control';
import type { StackScreenProps } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';

import Box from '../components/Box/Box';
import { queryKeys } from '../constants';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

import { InvoiceAttachmentsScreen } from './InvoiceAttachmentsScreen';
import { InvoicePackingSlipsScreen } from './InvoicePackingSlipsScreen';
import { InvoicePreviewScreen } from './InvoicePreviewScreen';
import { useInvoiceGetImagesCount } from '@/hooks/queries/useInvoiceGetImagesCount';
import { useInvoiceAttachments } from '@/hooks/queries/useInvoiceAttachments';

export type InvoiceOriginalsScreenProps = StackScreenProps<RootStackParamList, 'InvoiceOriginalsScreen'>;

export const InvoiceOriginalsScreen: React.FC<InvoiceOriginalsScreenProps> = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { t } = useTranslation();
  const id = route.params.id;

  // Queries for error/data detection
  const { imageCountQuery } = useInvoiceGetImagesCount(id);
  const { invoiceAttachments } = useInvoiceAttachments(id);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      queryClient.resetQueries({ queryKey: [queryKeys.invoiceImages, id] });
    });
    return unsubscribe;
  }, [id, navigation, queryClient]);

  // Only run auto-switch logic on first render
  const hasAutoSwitched = useRef(false);
  useEffect(() => {
    if (hasAutoSwitched.current) return;
    // Detect error in tab 0 (InvoicePreviewScreen)
    const err = imageCountQuery.error as any;
    const isError404 = err && typeof err === 'object' && 'response' in err && err.response && err.response.status === 404;
    if (
      selectedTab === 0 &&
      isError404 &&
      Array.isArray(invoiceAttachments) && invoiceAttachments.length > 0
    ) {
      hasAutoSwitched.current = true;
      const timeout = setTimeout(() => {
        setSelectedTab(1);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [selectedTab, imageCountQuery.error, invoiceAttachments]);

  const tabs = useMemo(
    () => [
      t('invoice_originals.tab_invoice'),
      t('invoice_originals.tab_attachments'),
      t('invoice_originals.tab_packing_slips'),
    ],
    [t],
  );

  return (
    <View style={{ flex: 1 }}>
      <Box
        borderBottom={1}
        borderColor={colors.borderColor}
        borderTop={Platform.OS === 'ios' ? 1 : 0}
        px={26}
        py={16}
        style={styles.toolbar}
      >
        {/* @ts-ignore (problem with typing.) */}
        <SegmentedControl
          appearance="light"
          selectedIndex={selectedTab}
          values={tabs}
          onChange={(event: any) => {
            setSelectedTab(event.nativeEvent.selectedSegmentIndex);
            // Reset auto-switch ref if user manually changes tab to 0
            if (event.nativeEvent.selectedSegmentIndex === 0) {
              hasAutoSwitched.current = true;
            }
          }}
        />
      </Box>
      {selectedTab === 0 && <InvoicePreviewScreen id={id} />}
      {selectedTab === 1 && <InvoiceAttachmentsScreen id={id} navigation={navigation} />}
      {selectedTab === 2 && <InvoicePackingSlipsScreen id={id} />}
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: colors.header.background,
  },
});
