import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { GetInvoiceImageResponse } from '@/api/ApiResponses';
import { queryKeys } from '@/constants';
import { useQueryKeySuffix } from '@/utils/queryUtils';

import { useApi } from '../useApi';

export const useInvoiceAttachmentImage = (id: string, page: number, isEnabled = true) => {
  const api = useApi();
  const query = useQuery({
    enabled: isEnabled,
    queryFn: () => {
      return api.invoice.getAttachmentImage(id)},
    queryKey: useQueryKeySuffix([queryKeys.invoiceImage, id, page]),
  });

const fileDataUri = useMemo(() => {
  if (!query.data) return undefined;

  if (query.data.startsWith("JVBERi0")) {
    return `data:application/pdf;base64,${query.data}`;
  }

  return `data:image/jpeg;base64,${query.data}`;
}, [query.data]);

  return {
    fileDataUri,
    query,
  };
};
