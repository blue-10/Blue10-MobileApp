import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';

import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { useActionIdToText } from '../hooks/useActionIdToText';
import { RootStackParamList } from '../navigation/types';
import { useInvoiceActionFormStore } from '../store/InvoiceActionFormStore';

export type InvoiceSelectActionScreenProps = NativeStackScreenProps<RootStackParamList, 'InvoiceSelectActionScreen'>;

type ActionItem = {
  id: number;
  title: string;
}

export const InvoiceSelectActionScreen: React.FC<InvoiceSelectActionScreenProps> = (
  {
    navigation,
    route: {
      params: {
        onlyShowActions = [],
        selectedActionId: selectedActionIdParam,
      },
    },
  },
) => {
  const actionIdToText = useActionIdToText();
  const [selectedActionId, setSelectedActionId] = useState<number|undefined>(selectedActionIdParam);
  const setActionSelectedActionId = useInvoiceActionFormStore((state) => state.setSelectedActionId);

  const items = useMemo<ActionItem[]>(() =>
    onlyShowActions.map((actionId) => ({
      id: actionId,
      title: actionIdToText(actionId),
    }))
  , [actionIdToText, onlyShowActions]);

  const renderItem: ListRenderItem<ActionItem> = useCallback(({ item, index }) => (
    <ListItem
      variant="checkbox"
      isChecked={item.id === selectedActionId}
      isEven={(index % 2 === 0)}
      title={item.title}
      onPress={() => {
        setSelectedActionId(item.id);
        setActionSelectedActionId(item.id);
        navigation.pop();
      }}
    />
  ), [navigation, selectedActionId, setActionSelectedActionId]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList<ActionItem>
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={ListSeparator}
      />
    </View>
  );
};
