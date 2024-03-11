import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import type { RootStackParamList } from './navigation/types';
import { DashboardScreen } from './screens/DashboardScreen';
import { InvoiceAttachmentAddScreen } from './screens/InvoiceAttachmentsAddScreen';
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
import { SearchFiltersScreen } from './screens/SearchFiltersScreen';
import { SearchResultsScreen } from './screens/SearchResultsScreen';
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
            component={DashboardScreen}
            name="Dashboard"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            component={SettingsScreen}
            name="Settings"
            options={{
              title: t('settings.screen_title'),
            }}
          />
          <Stack.Screen
            component={SwitchEnvironmentScreen}
            name="SwitchEnvironment"
            options={{
              title: t('switch_environments.screen_title'),
            }}
          />
          <Stack.Screen
            component={InvoicesToDoScreen}
            name="InvoicesToDoScreen"
            options={{
              title: t('to_do_invoices.screen_title'),
            }}
          />
          <Stack.Screen
            component={InvoiceDetailsScreen}
            name="InvoiceDetailsScreen"
            options={({ route }) => ({
              animation: route.params.disabledAnimation ? 'none' : 'default',
              title: t('invoice_details.title'),
            })}
          />
          <Stack.Screen
            component={InvoiceSelectUserScreen}
            name="InvoiceSelectUserScreen"
            options={{
              title: t('invoice_user_select.title'),
            }}
          />
          <Stack.Screen
            component={InvoiceSelectActionScreen}
            name="InvoiceSelectActionScreen"
            options={{
              title: t('invoice_action_select.title'),
            }}
          />
          <Stack.Screen
            component={InvoiceOriginalsScreen}
            name="InvoiceOriginalsScreen"
            options={{
              title: t('invoice_originals.title'),
            }}
          />
          <Stack.Screen
            component={InvoiceAttachmentAddScreen}
            name="InvoiceAttachmentAddScreen"
            options={{
              headerShown: false,
              title: t('invoice_attachnment_add.title'),
            }}
          />
          <Stack.Screen
            component={InvoiceBookingsScreen}
            name="InvoiceBookingsScreen"
            options={{
              title: t('invoice_bookings.title'),
            }}
          />
          <Stack.Screen
            component={InvoiceTimelineScreen}
            name="InvoiceTimelineScreen"
            options={{
              title: t('invoice_timeline.title'),
            }}
          />
          <Stack.Screen
            component={ScanSelectCompanyScreen}
            name="ScanSelectCompanyScreen"
            options={{
              title: t('scan.company_title'),
            }}
          />
          <Stack.Screen
            component={ScanSelectDocumentTypeScreen}
            name="ScanSelectDocumentTypeScreen"
            options={{
              headerBackTitle: t('scan.company_title'),
              title: t('scan.document_type_title'),
            }}
          />
          <Stack.Screen
            component={ScanPreviewScreen}
            name="ScanPreviewScreen"
            options={{
              headerShown: false,
              title: t('scan.preview_title'),
            }}
          />
          <Stack.Screen
            component={SearchFiltersScreen}
            name="SearchFiltersScreen"
            options={{
              title: t('search.screen_title'),
            }}
          />
          <Stack.Screen
            component={SearchResultsScreen}
            name="SearchResultsScreen"
            options={{
              title: t('search.results_title'),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default Screens;
