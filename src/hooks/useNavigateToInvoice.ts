import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import type { NavigateInvoiceAnimationTypes } from '@/navigation/types';

export type UseNavigateToInvoiceExtraParams = {
  animationType?: NavigateInvoiceAnimationTypes;
};

export const useNavigateToInvoice = () => {
  const navigation = useNavigation();

  const navigateToInvoice = useCallback(
    (toInvoiceId: string, params?: UseNavigateToInvoiceExtraParams | undefined) => {
      const { animationType = 'none' } = params || {};

      // @ts-ignore replace does exists, but not in types.
      navigation.replace('InvoiceDetailsScreen', {
        animationType,
        id: toInvoiceId,
      });
    },
    [navigation],
  );

  return navigateToInvoice;
};
