import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { queryKeys } from '../../constants';

export const useInvalidateInvoiceAttachments = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (invoiceId: string) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoiceAttachments, invoiceId] });
    },
    [queryClient],
  );
};
