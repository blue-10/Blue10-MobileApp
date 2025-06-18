import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import LoginSite from '../components/LoginSite/LoginSite';
import { useApiStore } from '../store/ApiStore';
import { colors } from '../theme';

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
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <LoginSite mode="login" onRefreshToken={(refreshToken, baseUrl) => onRefreshToken(refreshToken, baseUrl)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
  },
});
