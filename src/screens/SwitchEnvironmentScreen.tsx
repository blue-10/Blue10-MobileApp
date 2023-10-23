import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';

import LoginSite from '../components/LoginSite/LoginSite';
import LoginSiteLoader from '../components/LoginSite/LoginSiteLoader';
import { useApi } from '../hooks/useApi';
import { RootStackParamList } from '../navigation/types';
import { useApiStore } from '../store/ApiStore';

type Props = NativeStackScreenProps<RootStackParamList, 'SwitchEnvironment'>;

export const SwitchEnvironmentScreen: React.FC<Props> = ({ navigation }) => {
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const api = useApi();
  const setBaseUrlAndRefreshToken = useApiStore((state) => state.setBaseUrlAndRefreshToken);
  const onRefreshToken = async (refreshToken: string, baseUrl: string) => {
    await setBaseUrlAndRefreshToken(refreshToken, baseUrl);

    // make sure that react query cache is cleared and that the new company isn't shown until all data from the
    // previous company has been reset
    setIsResetting(true);
    await queryClient.resetQueries();
    setIsResetting(false);
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" animated />
      {isResetting
        ? <LoginSiteLoader />
        : (
          <LoginSite
            mode="environment"
            refreshToken={api.refreshToken}
            onRefreshToken={(refreshToken, baseUrl) => onRefreshToken(refreshToken, baseUrl)}
          />
        )}
    </SafeAreaView>
  );
};
