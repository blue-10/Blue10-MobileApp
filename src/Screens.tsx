import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { RootStackParamList } from './navigation/types';
import { DashboardScreen } from './screens/DashboardScreen';
import { InvoiceBookingsScreen } from './screens/InvoiceBookingsScreen';
import { InvoiceDetailsScreen } from './screens/InvoiceDetailsScreen';
import { InvoiceOriginalsScreen } from './screens/InvoiceOriginalsScreen';
import { InvoiceSelectActionScreen } from './screens/InvoiceSelectActionScreen';
import { InvoiceSelectUserScreen } from './screens/InvoiceSelectUserScreen';
import { InvoicesToDoScreen } from './screens/InvoicesToDoScreen';
import { InvoiceTimelineScreen } from './screens/InvoiceTimelineScreen';
import { ScanPreviewScreen } from './screens/ScanPreviewScreen';
import { ScanSelectCompanyScreen } from './screens/ScanSelectCompanyScreen';
import { ScanSelectDocumentTypeScreen } from './screens/ScanSelectDocumentTypeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SwitchEnvironmentScreen } from './screens/SwitchEnvironmentScreen';
import { colors } from './theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Screens: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.header.background,
            },
          }}
        >
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              headerShown: false,
            }}
          />
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
            name="InvoicesToDoScreen"
            component={InvoicesToDoScreen}
            options={{
              title: t('to_do_invoices.screen_title'),
            }}
          />
          <Stack.Screen
            name="InvoiceDetailsScreen"
            component={InvoiceDetailsScreen}
            options={({ route }) => ({
              animation: route.params.disabledAnimation ? 'none' : 'default',
              title: t('invoice_details.title'),
            })}
          />
          <Stack.Screen
            name="InvoiceSelectUserScreen"
            component={InvoiceSelectUserScreen}
            options={{
              title: t('invoice_user_select.title'),
            }}
          />
          <Stack.Screen
            name="InvoiceSelectActionScreen"
            component={InvoiceSelectActionScreen}
            options={{
              title: t('invoice_action_select.title'),
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
          <Stack.Screen
            name="ScanSelectCompanyScreen"
            component={ScanSelectCompanyScreen}
            options={{
              title: t('scan.company_title'),
            }}
          />
          <Stack.Screen
            name="ScanSelectDocumentTypeScreen"
            component={ScanSelectDocumentTypeScreen}
            options={{
              headerBackTitle: t('scan.company_title'),
              title: t('scan.document_type_title'),
            }}
          />
          <Stack.Screen
            name="ScanPreviewScreen"
            component={ScanPreviewScreen}
            options={{
              headerShown: false,
              title: t('scan.preview_title'),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default Screens;
