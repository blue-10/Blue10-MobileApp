import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../constants';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

export const useGetApprovedInvoiceCount = () => {
  const api = useApi();

  const query = useQuery(
    useQueryKeySuffix([queryKeys.invoicesToApprove, 'totalCount']),
    async () => api.invoice.getTotalCount({
      CurrentPage: 1,
      LinkedToDocument: 0,
      PageSize: 1,
      SortAscending: false,
      SortName: 'DocumentDate',
      Status: 7,
    }),
  );

  return {
    count: query.data || 0,
    isLoading: query.isLoading,
  };
};
