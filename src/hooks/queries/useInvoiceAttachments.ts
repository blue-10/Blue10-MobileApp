import { queryKeys } from '@/constants';
import { normalizeInvoiceAttachmentFromResponseItem } from '@/entity/invoice/normalizer';
import { normalizeMap } from '@/utils/normalizerUtils';
import { useQueryKeySuffix } from '@/utils/queryUtils';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../useApi';

export const useInvoiceAttachments = (id: string) => {
  const api = useApi();

  const query = useQuery({
    queryKey: useQueryKeySuffix([queryKeys.invoiceAttachments, id]),
    queryFn: async () => {
      const response = await api.invoice.getAttachments(id);
      return normalizeMap(response, normalizeInvoiceAttachmentFromResponseItem);
    },
  });

  return {
    invoiceAttachments: query.data ?? [],
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
    query,
  };
};