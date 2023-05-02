import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { FlatList, StatusBar, View } from 'react-native';

import { Environment } from '../api/types';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import { useApi } from '../hooks/useApi';
import { RootStackParamList } from '../navigation/types';
import { getRefreshControl } from '../utils/refreshControl';

type Props = NativeStackScreenProps<RootStackParamList, 'SwitchEnvironment'>;

export const SwitchEnvironmentScreen: React.FC<Props> = ({ navigation }) => {
  const queryClient = useQueryClient();
  const api = useApi();

  // region react query
  const {
    isLoading,
    error,
    data: environments = [],
  } = useQuery(
    [queryKeys.environments],
    () => api.placeholderResponses.getEnvironments(),
  );

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  // endregion

  // region TODO: NEED IMPLEMENTATION
  const environmentId = 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba'; // for now
  const setEnvironment = useCallback((_id: string, _name: string) => {
    // TODO: set new environment and refresh cache

    navigation.pop();
  }, [navigation]);
  // endregion

  const renderItem = useCallback(({ item, index }: { item: Environment; index: number }) => (
    <ListItem
      isEven={(index % 2 === 0)}
      title={item.name}
      variant="checkbox"
      isChecked={item.id === environmentId}
      onPress={() => {
        setEnvironment(item.id, item.name);
      }}
    />
  ), [setEnvironment, environmentId]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" animated />
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
