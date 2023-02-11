import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import Box from '../components/Box/Box';
import i18n, { translationKeys } from '../i18n/i18n';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { InvoiceAttachmentsScreen } from './InvoiceAttachmentsScreen';
import { InvoicePackingSlipsScreen } from './InvoicePackingSlipsScreen';
import { InvoicePreviewScreen } from './InvoicePreviewScreen';

const tabs = [
  i18n.translate(translationKeys.invoice_originals.tab_invoice),
  i18n.translate(translationKeys.invoice_originals.tab_attachments),
  i18n.translate(translationKeys.invoice_originals.tab_packing_slips),
];

type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceOriginalsScreen'>;

export const InvoiceOriginalsScreen: React.FC<Props> = ({ route }) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const id = route.params.id;

  return (
    <View style={{ flex: 1 }}>
      <Box
        style={styles.toolbar}
        py={16}
        px={26}
        borderTop={Platform.OS === 'ios' ? 1 : 0}
        borderBottom={1}
        borderColor={colors.borderColor}
      >
        <SegmentedControl
          values={tabs}
          selectedIndex={selectedTab}
          appearance="light"
          onChange={(event) => {
            setSelectedTab(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </Box>
      {selectedTab === 0 && (<InvoicePreviewScreen />)}
      {selectedTab === 1 && (<InvoiceAttachmentsScreen id={id} />)}
      {selectedTab === 2 && (<InvoicePackingSlipsScreen id={id} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: colors.white,
  },
});
