import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../constants';
import { normalizeInvoiceFromResponse } from '../../entity/invoice/normalizer';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

export const useInvoiceDetails = (id: string) => {
  const api = useApi();
  const query = useQuery({
    enabled: !!id,
    queryFn: async () => normalizeInvoiceFromResponse(await api.invoice.get(id)),
    queryKey: useQueryKeySuffix([queryKeys.invoice, id]),
  });

  return query;
};
