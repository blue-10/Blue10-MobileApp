import { defaultTheme, Provider } from '@react-native-material/core';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';

import { t } from './src/i18n/i18n';
import { RootStackParamList } from './src/navigation/types';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { InvoiceTimelineScreen } from './src/screens/InvoiceTimelineScreen';
import { InvoiceBookingsScreen } from './src/screens/InvoiceBookingsScreen';
import { InvoiceDetailsScreen } from './src/screens/InvoiceDetailsScreen';
import { InvoiceOriginalsScreen } from './src/screens/InvoiceOriginalsScreen';
import { InvoiceSelectUserScreen } from './src/screens/InvoiceSelectUserScreen';
import { InvoicesToApproveScreen } from './src/screens/InvoicesToApproveScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SwitchEnvironmentScreen } from './src/screens/SwitchEnvironmentScreen';
import { useAuthStore } from './src/store/AuthStore';
import { colors } from './src/theme';
import { globalDisableConsoleForProductionAndStaging } from './src/utils/disableConsoles';

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator<RootStackParamList>();

// noinspection JSUnusedGlobalSymbols
export const App: React.FC = () => {
  // region console
  useEffect(() => {
    globalDisableConsoleForProductionAndStaging();
  }, []);
  // endregion
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <QueryClientProvider client={queryClient}>
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
        <>
          {!isLoggedIn
            ? (<LoginScreen />)
            : (
              <NavigationContainer>
                <Stack.Navigator>
                  <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
                  <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                      title: t('settings.screen_title'),
                    }}
                  />
                  <Stack.Screen
                    name="SwitchEnvironment"
                    component={SwitchEnvironmentScreen} options={{
                      title: t('switch_environments.screen_title'),
                    }}
                  />
                  <Stack.Screen
                    name="InvoicesToApproveScreen"
                    component={InvoicesToApproveScreen}
                    options={{
                      title: t('to_approved_invoices.screen_title'),
                    }}
                  />
                  <Stack.Screen
                    name="InvoiceDetailsScreen"
                    component={InvoiceDetailsScreen}
                    options={{
                      title: t('invoice_details.title'),
                    }}
                  />
                  <Stack.Screen
                    name="InvoiceSelectUserScreen"
                    component={InvoiceSelectUserScreen}
                    options={{
                      title: t('invoice_user_select.title'),
                    }}
                  />
                  <Stack.Screen
                    name="InvoiceOriginalsScreen"
                    component={InvoiceOriginalsScreen}
                    options={{
                      title: t('invoice_originals.title'),
                    }}
                  />
                  <Stack.Screen
                    name="InvoiceBookingsScreen"
                    component={InvoiceBookingsScreen}
                    options={{
                      title: t('invoice_bookings.title'),
                    }}
                  />
                  <Stack.Screen
                    name="InvoiceTimelineScreen"
                    component={InvoiceTimelineScreen}
                    options={{
                      title: t('invoice_timeline.title'),
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            )}
        </>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
