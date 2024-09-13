import type { QueryClient } from '@tanstack/react-query';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { RefreshControl } from 'react-native';

import { colors } from '../theme';

/**
 * Helper method to create refresh control with invalidating/remove query keys
 * note: creating a React component "RefreshControl" does not seem to work with flat list :(
 *
 * @param queryClient
 * @param queryKeys
 * @param isRefreshing
 */
export const getRefreshControl = (queryClient: QueryClient, queryKeys: string[], isRefreshing: boolean) => (
  <RefreshControl
    colors={[colors.primary]} // android
    enabled={true}
    refreshing={isRefreshing}
    tintColor={colors.primary} // ios
    onRefresh={async () => {
      queryClient.cancelQueries({ queryKey: queryKeys }).then();
      queryClient.invalidateQueries({ queryKey: queryKeys }).then();
      queryClient.removeQueries({ queryKey: queryKeys });
    }}
  />
);
