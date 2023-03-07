import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import LoginSite from '../components/LoginSite/LoginSite';
import { useApiStore } from '../store/ApiStore';

export const LoginScreen: React.FC = () => {
  const setBaseUrlAndRefreshToken = useApiStore((state) => state.setBaseUrlAndRefreshToken);
  const loadRefreshTokenFromStore = useApiStore((state) => state.loadRefreshTokenFromStore);
  const queryClient = useQueryClient();

  const onRefreshToken = async (refreshToken: string, baseUrl: string) => {
    await setBaseUrlAndRefreshToken(refreshToken, baseUrl);
  };

  // make sure the react query cache is empty
  useEffect(() => {
    queryClient.resetQueries();
  }, [queryClient]);

  // load from store if possible
  useEffect(() => {
    loadRefreshTokenFromStore();
  }, [loadRefreshTokenFromStore]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="default" backgroundColor="black" animated />
      <LoginSite
        onRefreshToken={(refreshToken, baseUrl) => onRefreshToken(refreshToken, baseUrl)}
      />
    </SafeAreaView>
  );
};
