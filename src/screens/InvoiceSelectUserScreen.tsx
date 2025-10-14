import type { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { ListRenderItem } from 'react-native';
import { FlatList, View } from 'react-native';

import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import type { User } from '../entity/system/types';
import { useGetAllUsers } from '../hooks/queries/useGetAllUsers';
import type { RootStackParamList } from '../navigation/types';
import { useInvoiceActionFormStore } from '../store/InvoiceActionFormStore';

type Props = StackScreenProps<RootStackParamList, 'InvoiceSelectUserScreen'>;

export const InvoiceSelectUserScreen: React.FC<Props> = ({
  navigation,
  route: {
    params: { onlyShowUsers, selectedUserId: selectedUserIdParam },
  },
}) => {
  const { data } = useGetAllUsers();
  const [selectedUserId, setSelectedUserId] = useState<string>(selectedUserIdParam ?? '');
  const setActionFormUserId = useInvoiceActionFormStore((state) => state.setSelectedUserId);
  const setHasUserSelected = useInvoiceActionFormStore((state) => state.setHasUserSelected);

  const items = useMemo(() => {
    return onlyShowUsers ? data.filter((user) => onlyShowUsers.includes(user.id)) : data;
  }, [onlyShowUsers, data]);

  const renderItem: ListRenderItem<User> = useCallback(
    ({ item, index }) => (
      <ListItem
        isChecked={item.id === selectedUserId}
        isEven={index % 2 === 0}
        title={item.name}
        variant="checkbox"
        onPress={() => {
          setSelectedUserId(item.id);
          setActionFormUserId(item.id);
          setHasUserSelected(true);
          navigation.pop();
        }}
      />
    ),
    [navigation, selectedUserId, setActionFormUserId],
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList<User>
        data={items}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ minHeight: 90 }}
      />
    </View>
  );
};
