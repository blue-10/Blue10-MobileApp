import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { FlatList, StatusBar, View } from 'react-native';

import { getEnvironments } from '../api/api';
import { Environment } from '../api/types';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/AuthStore';
import { getRefreshControl } from '../utils/refreshControl';

type Props = NativeStackScreenProps<RootStackParamList, 'SwitchEnvironment'>;

export const SwitchEnvironmentScreen: React.FC<Props> = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { token, setEnvironment, environmentId } = useAuthStore(({
    token,
    environmentId,
    setEnvironment,
  }) => ({
    environmentId,
    setEnvironment,
    token,
  }));

  // region react query
  const fnGetEnvironments = useCallback(
    () => getEnvironments(token ?? 'xxx'),
    [token],
  );

  const {
    isLoading,
    error,
    data: environments = [],
  } = useQuery(
    [queryKeys.environments],
    fnGetEnvironments,
    {},
  );

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  // endregion

  const renderItem = useCallback(({ item, index }: { item: Environment; index: number }) => (
    <ListItem
      isEven={(index % 2 === 0)}
      title={item.name}
      variant="checkbox"
      isChecked={item.id === environmentId}
      onPress={() => {
        setEnvironment(item.id, item.name);
        navigation.pop();
      }}
    />
  ), [navigation, setEnvironment, environmentId]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="default" animated />
      <FlatList<Environment>
        style={{ minHeight: 90 }}
        data={environments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ListSeparator}
        refreshControl={getRefreshControl(queryClient, [queryKeys.environments], isLoading)}
      />
    </View>
  );
};
