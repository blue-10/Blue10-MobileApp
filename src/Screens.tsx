import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { forSlideLeftToRight, forSlideRightToLeft } from './navigation/forSlide';
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
import { HistoryScreen } from './screens/HistoryScreen';

const Stack = createStackNavigator<RootStackParamList>();
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
            component={HistoryScreen}
            name="history"
            options={{
              title: t('dashboard.history'),
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
            options={({ route }) => {
              const extraParams: Record<string, any> = {};
              const headerStyle = () => ({
                backgroundStyle: {},
                leftButtonStyle: {},
                rightButtonStyle: {},
                titleStyle: {},
              });

              switch (route.params.animationType) {
                case 'next':
                  extraParams.headerMode = 'float'; // make sure that header does not move when doing the animation
                  extraParams.headerStyleInterpolator = headerStyle; // no style changes in the header.
                  extraParams.cardStyleInterpolator = forSlideRightToLeft;
                  break;
                case 'previous':
                  extraParams.headerMode = 'float';
                  extraParams.headerStyleInterpolator = headerStyle;
                  extraParams.cardStyleInterpolator = forSlideLeftToRight;
                  break;
                case 'none':
                  extraParams.animation = 'none';
                  break;
              }

              return {
                title: t('invoice_details.title'),
                ...extraParams,
              };
            }}
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
