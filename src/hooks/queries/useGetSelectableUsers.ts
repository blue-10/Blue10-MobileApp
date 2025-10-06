import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../constants';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

export const useGetSelectableUsers = () => {
  const api = useApi();

  const query = useQuery({
    queryFn: async () => await api.user.getSelectableUsers(),
    queryKey: useQueryKeySuffix([queryKeys.selectableUsers]),

    staleTime: 60 * 1000 * 10, // 5 minutes
  });

  return {
    data: query.data ?? [],
    query,
  };
};
