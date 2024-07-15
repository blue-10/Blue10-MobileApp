import type { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import type React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import type { RootStackParamList } from '../navigation/types';
import { DocumentType, useImageStore } from '../store/ImageStore';

type ScanSelectDocumentTypeScreenProps = StackScreenProps<RootStackParamList, 'ScanSelectDocumentTypeScreen'>;

export const ScanSelectDocumentTypeScreen: React.FC<ScanSelectDocumentTypeScreenProps> = ({ navigation }) => {
  const { company, documentType, setDocumentType } = useImageStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (company === undefined) {
      navigation.navigate('ScanSelectCompanyScreen');
    }
  }, [company, navigation, setDocumentType]);

  const renderItem = useCallback(
    ({ item, index }: { item: DocumentType; index: number }) => {
      return (
        <ListItem
          isChecked={documentType?.key === item.key}
          isEven={index % 2 === 0}
          title={t(`scan.document_type_${item.key}`)}
          onPress={() => {
            setDocumentType(item);
            navigation.navigate('ScanPreviewScreen');
          }}
        />
      );
    },
    [documentType, navigation, setDocumentType, t],
  );

  const documentTypes = useMemo(() => {
    const retValue = [DocumentType.PURCHASE_INVOICE];

    if (company?.UsesSalesInvoices) {
      retValue.push(DocumentType.SALES_INVOICE);
    }

    if (company?.UsesPackingSlips) {
      retValue.push(DocumentType.PACKING_SLIP);
    }

    return retValue;
  }, [company]);

  return (
    <View>
      <StatusBar animated style="dark" />
      <FlatList<DocumentType>
        data={documentTypes}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={(item) => item.key}
        ListEmptyComponent={View}
        renderItem={renderItem}
        style={{ minHeight: 90 }} // without height the refresh indicator is not visible during reload
      />
    </View>
  );
};
