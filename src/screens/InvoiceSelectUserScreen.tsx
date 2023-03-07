import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';

import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { User } from '../entity/system/types';
import { useGetAllUsers } from '../hooks/queries/useGetAllUsers';
import { RootStackParamList } from '../navigation/types';
import { useInvoiceActionFormStore } from '../store/InvoiceActionFormStore';

type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceSelectUserScreen'>;

export const InvoiceSelectUserScreen: React.FC<Props> = ({
  navigation,
  route: {
    params: {
      onlyShowUsers,
      selectedUserId: selectedUserIdParam,
    },
  },
}) => {
  const { data } = useGetAllUsers();
  const [selectedUserId, setSelectedUserId] = useState<string>(selectedUserIdParam ?? '');
  const setActionFormUserId = useInvoiceActionFormStore((state) => state.setSelectedUserId);

  const items = useMemo(() => {
    return onlyShowUsers ? data.filter((user) => onlyShowUsers.includes(user.id)) : data;
  }, [onlyShowUsers, data]);

  const renderItem: ListRenderItem<User> = useCallback(({ item, index }) => (
    <ListItem
      variant="checkbox"
      isChecked={item.id === selectedUserId}
      isEven={(index % 2 === 0)}
      title={item.name}
      onPress={() => {
        setSelectedUserId(item.id);
        setActionFormUserId(item.id);
        navigation.pop();
      }}
    />
  ), [navigation, selectedUserId, setActionFormUserId]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList<User>
        style={{ minHeight: 90 }}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ListSeparator}
      />
    </View>
  );
};
