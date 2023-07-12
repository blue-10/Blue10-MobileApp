import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../constants';
import { normalizeInvoiceFromResponse } from '../../entity/invoice/normalizer';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

export const useInvoiceDetails = (id: string) => {
  const api = useApi();
  const query = useQuery(
    useQueryKeySuffix([queryKeys.invoice, id]),
    async () => normalizeInvoiceFromResponse(await api.invoice.get(id)),
    {
      enabled: !!id,
    },
  );

  return query;
};
