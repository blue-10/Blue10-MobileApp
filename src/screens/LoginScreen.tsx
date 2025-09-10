import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useEffect } from 'react';
import { Linking, SafeAreaView, StatusBar, StyleSheet } from 'react-native';

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

  // handle URL scheme callback
  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      console.log('Received URL:', url);

      // parse token from URL
      const tokenMatch = url.match(/token=([^&]+)/);
      if (!tokenMatch) return;
      const token = tokenMatch[1];

      const baseUrl = 'https://login.blue10development.com/?mobile=true';

      // set refresh token
      onRefreshToken(token, baseUrl);
    };

    // listener for when the app is open
    Linking.addEventListener('url', handleUrl);
    
    // when app is opened from a closed state
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    const subscription = Linking.addEventListener('url', handleUrl);

    Linking.getInitialURL().then(url => {
      if (url) handleUrl({ url });
    });

    return () => subscription.remove();
  }, []);

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
