import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';

import { getUsers } from '../api/api';
import { User } from '../api/types';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/AuthStore';

type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceSelectUserScreen'>;

export const InvoiceSelectUserScreen: React.FC<Props> = ({
  navigation,
}) => {
  const { token, environmentId } = useAuthStore(({ token, environmentId }) => ({ environmentId, token }));
  const [selectedUserId] = useState<string>('1');

  const {
    data: users = [],
  } = useQuery(
    [queryKeys.users, environmentId],
    () => getUsers(token ?? 'xxx', environmentId ?? 'xxx'),
  );
  const renderItem: ListRenderItem<User> = useCallback(({ item, index }) => (
    <ListItem
      variant="checkbox"
      isChecked={item.id === selectedUserId}
      isEven={(index % 2 === 0)}
      title={item.name}
      onPress={() => {
        navigation.pop();
      }}
    />
  ), [navigation, selectedUserId]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList<User>
        style={{ minHeight: 90 }}
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ListSeparator}
      />
    </View>
  );
};
