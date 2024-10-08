import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { queryKeys } from '../../constants';
import { useGetCurrentUser } from '../queries/useGetCurrentUser';

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
  const currentUser = useGetCurrentUser();

  return useCallback(
    async (invoiceId: string) => {
      invoiceQueryKeys.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: [queryKey, invoiceId] });
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeys.invoiceResults],
      });

      await queryClient.invalidateQueries({
        queryKey: [
          queryKeys.invoicesToDo,
          'totalCount',
          `user-${currentUser.currentUser?.Id}`,
          `belongs-to-${currentUser.currentUser?.BelongsTo}`,
        ],
      });
    },
    [currentUser.currentUser, queryClient],
  );
};
