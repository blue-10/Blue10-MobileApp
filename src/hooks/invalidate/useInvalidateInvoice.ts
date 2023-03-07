import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { queryKeys } from '../../constants';

const invoiceQueryKeys = [
  queryKeys.invoice,
  queryKeys.invoiceAttachments,
  queryKeys.invoicePackingSlips,
  queryKeys.invoiceBookings,
  queryKeys.invoiceImageCount,
  queryKeys.invoiceImages,
  queryKeys.invoiceActions,
];

export const useInvalidateInvoice = () => {
  const queryClient = useQueryClient();

  return useCallback((invoiceId: string) => {
    invoiceQueryKeys.forEach((queryKey) => {
      queryClient.invalidateQueries([queryKey, invoiceId]);
    });
  },
  [queryClient]);
};
