import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { queryKeys } from '../../constants';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

export const useInvoiceGetImagesCount = (id: string) => {
  const api = useApi();
  const imageCountQuery = useQuery({
    queryFn: () => api.invoice.getImageCount(id),
    queryKey: useQueryKeySuffix([queryKeys.invoiceImageCount, id]),
  });
  const imageCount = useMemo(() => imageCountQuery.data ?? 0, [imageCountQuery.data]);

  return {
    imageCount,
    imageCountQuery,
  };
};
