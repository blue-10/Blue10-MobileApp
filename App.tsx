// region polyfill need Intl (because of android does not support it and iOS is missing plural function)
import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-locale/polyfill';
// polyfull for plural rules
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en'; // locale-data for en
import '@formatjs/intl-pluralrules/locale-data/nl'; // locale-data for nl
// polyfill for android to numberformat
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en'; // locale-data for en
import '@formatjs/intl-numberformat/locale-data/nl'; // locale-data for nl
// endregion
import 'core-js/stable/atob';
import './src/i18n/i18n.config';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { defaultTheme, Provider } from '@react-native-material/core';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import addMinutes from 'date-fns/addMinutes';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { REFRESH_GET_BEFORE_IN_MINUTES } from './src/api/ApiService';
import { ToastProvider } from './src/components/Toast/ToastProvider';
import Screens from './src/Screens';
import { LoginScreen } from './src/screens/LoginScreen';
import { useApiStore } from './src/store/ApiStore';
import { colors } from './src/theme';
import { globalDisableConsoleForProductionAndStaging } from './src/utils/disableConsoles';
import { inDevelopment } from './src/utils/inDevelopment';

const queryClient = new QueryClient();

// init sentry
Sentry.init({
  debug: inDevelopment(),
  dsn: 'https://48471c030a71448980935deb191f35f3@sentry.wecreatesolutions.nl/25',
});

// noinspection JSUnusedGlobalSymbols
export const App: React.FC = () => {
  const hasRefreshToken = useApiStore((state) => state.hasRefreshToken);
  const refreshTokenValidUntil = useApiStore((state) => state.refreshTokenValidUntil);
  const getNewRefreshToken = useApiStore((state) => state.getNewRefreshToken);

  // region console
  useEffect(() => {
    globalDisableConsoleForProductionAndStaging();
  }, []);
  // endregion

  useEffect(() => {
    if (hasRefreshToken && refreshTokenValidUntil !== undefined) {
      const refreshTokenTime = addMinutes(refreshTokenValidUntil, REFRESH_GET_BEFORE_IN_MINUTES + 2).getTime();
      const duration = refreshTokenTime - new Date().getTime();
      if (duration < 0) { // refresh token is already expired! (should clear the store and show the login page)
        getNewRefreshToken();
        return;
      }
      // create a timer so that te
      const timer = setTimeout(() => getNewRefreshToken(), duration);
      return () => clearTimeout(timer);
    }
  }, [getNewRefreshToken, hasRefreshToken, refreshTokenValidUntil]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        {/* @ts-ignore gives error that children is not set. But that is because it builds for React 17 */}
        <Provider
          theme={{
            ...defaultTheme,
            palette: {
              ...defaultTheme.palette,
              primary: { main: colors.primary, on: 'white' },
            },
          }}
        >
          <ToastProvider>
            <ActionSheetProvider>
              {!hasRefreshToken ? (<LoginScreen />) : (<Screens />)}
            </ActionSheetProvider>
          </ToastProvider>
        </Provider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
