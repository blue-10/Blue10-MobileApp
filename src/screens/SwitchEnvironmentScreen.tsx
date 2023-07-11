import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { StatusBar, View } from 'react-native';

import LoginSite from '../components/LoginSite/LoginSite';
import { useApi } from '../hooks/useApi';
import { RootStackParamList } from '../navigation/types';
import { useApiStore } from '../store/ApiStore';

type Props = NativeStackScreenProps<RootStackParamList, 'SwitchEnvironment'>;

export const SwitchEnvironmentScreen: React.FC<Props> = ({ navigation }) => {
  const queryClient = useQueryClient();
  const api = useApi();
  const setBaseUrlAndRefreshToken = useApiStore((state) => state.setBaseUrlAndRefreshToken);
  const onRefreshToken = async (refreshToken: string, baseUrl: string) => {
    await setBaseUrlAndRefreshToken(refreshToken, baseUrl);
    // make sure that react query cache is cleared.
    queryClient.invalidateQueries();
    // navigate back to dashboard
    navigation.navigate('Dashboard');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" animated />
      <LoginSite
        mode="environment"
        refreshToken={api.refreshToken}
        onRefreshToken={(refreshToken, baseUrl) => onRefreshToken(refreshToken, baseUrl)}
      />
    </View>
  );
};
