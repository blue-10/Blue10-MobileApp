import type { StackScreenProps } from '@react-navigation/stack';
import { useCallback, useMemo, useState } from 'react';
import type { ListRenderItem } from 'react-native';
import { FlatList, View } from 'react-native';

import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { useActionIdToText } from '../hooks/useActionIdToText';
import type { RootStackParamList } from '../navigation/types';
import { useInvoiceActionFormStore } from '../store/InvoiceActionFormStore';

export type InvoiceSelectActionScreenProps = StackScreenProps<RootStackParamList, 'InvoiceSelectActionScreen'>;

type ActionItem = {
  id: number;
  title: string;
};

export const InvoiceSelectActionScreen: React.FC<InvoiceSelectActionScreenProps> = ({
  navigation,
  route: {
    params: { onlyShowActions = [], selectedActionId: selectedActionIdParam },
  },
}) => {
  const actionIdToText = useActionIdToText();
  const [selectedActionId, setSelectedActionId] = useState<number | undefined>(selectedActionIdParam);
  const setActionSelectedActionId = useInvoiceActionFormStore((state) => state.setSelectedActionId);

  const items = useMemo<ActionItem[]>(
    () =>
      onlyShowActions.map((actionId) => ({
        id: actionId,
        title: actionIdToText(actionId),
      })),
    [actionIdToText, onlyShowActions],
  );

  const renderItem: ListRenderItem<ActionItem> = useCallback(
    ({ item, index }) => (
      <ListItem
        isChecked={item.id === selectedActionId}
        isEven={index % 2 === 0}
        title={item.title}
        variant="checkbox"
        onPress={() => {
          setSelectedActionId(item.id);
          setActionSelectedActionId(item.id);
          navigation.pop();
        }}
      />
    ),
    [navigation, selectedActionId, setActionSelectedActionId],
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList<ActionItem>
        data={items}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};
