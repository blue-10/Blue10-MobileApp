import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { RootStackParamList } from '../navigation/types';
import { DocumentType, useImageStore } from '../store/ImageStore';

type ScanSelectDocumentTypeScreenProps = NativeStackScreenProps<RootStackParamList, 'ScanSelectDocumentTypeScreen'>;

export const ScanSelectDocumentTypeScreen: React.FC<ScanSelectDocumentTypeScreenProps> = ({ navigation }) => {
  const { company, documentType, setDocumentType } = useImageStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (company === undefined) {
      navigation.navigate('ScanSelectCompanyScreen');
    }
  }, [company, navigation, setDocumentType]);

  const renderItem = useCallback(({ item, index }: { item: DocumentType; index: number }) => {
    return (
      <ListItem
        title={t(`scan.document_type_${item.key}`)}
        isEven={index % 2 === 0}
        isChecked={documentType?.key === item.key}
        onPress={() => {
          setDocumentType(item);
          navigation.navigate('ScanPreviewScreen');
        }}
      />
    );
  }, [documentType, navigation, setDocumentType, t]);

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
      <StatusBar style="dark" animated />
      <FlatList<DocumentType>
        style={{ minHeight: 90 }} // without height the refresh indicator is not visible during reload
        data={documentTypes}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ItemSeparatorComponent={ListSeparator}
        ListEmptyComponent={View}
      />
    </View>
  );
};
