import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../constants';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';
import { useGetCurrentUser } from './useGetCurrentUser';

export const useGetToDoInvoiceCount = () => {
  const api = useApi();

  const currentUser = useGetCurrentUser();

  const query = useQuery(
    {
      queryFn: async () => api.invoice.getTotalCount({
        CurrentPage: 1,
        CurrentUser: [currentUser.currentUser?.Id, currentUser.currentUser?.BelongsTo]
          .filter((s) => typeof s !== 'undefined' && s !== '')
          .join(','),
        LinkedToDocument: 0,
        PageSize: 1,
        SortAscending: false,
        SortName: 'DocumentDate',
        Status: 11,
      }),
      queryKey: useQueryKeySuffix([
        queryKeys.invoicesToDo,
        'totalCount',
        `user-${currentUser.currentUser?.Id}`,
        `belongs-to-${currentUser.currentUser?.BelongsTo}`,
      ]),
    });

  return {
    count: query.data || 0,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
