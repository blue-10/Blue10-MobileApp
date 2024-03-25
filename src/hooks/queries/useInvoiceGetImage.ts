import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { GetInvoiceImageResponse } from '@/api/ApiResponses';
import { queryKeys } from '@/constants';
import { useQueryKeySuffix } from '@/utils/queryUtils';

import { useApi } from '../useApi';

export const useInvoiceGetImage = (id: string, page: number, isEnabled = true) => {
  const api = useApi();
  const query = useQuery<GetInvoiceImageResponse>({
    enabled: isEnabled,
    queryFn: () => api.invoice.getImage(id, page),
    queryKey: useQueryKeySuffix([queryKeys.invoiceImage, id, page]),
  });

  const imageDataUri = useMemo(() => {
    if (query.data?.Image) {
      return `data:image/jpeg;base64,${query.data.Image}`;
    }
  }, [query.data?.Image]);

  return {
    imageDataUri,
    query,
  };
};
