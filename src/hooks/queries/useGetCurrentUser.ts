import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../constants';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

export const useGetCurrentUser = () => {
  const api = useApi();

  const query = useQuery({
    queryFn: () => api.user.getCurrentUser(),
    queryKey: useQueryKeySuffix([queryKeys.currentUser]),
  });

  return { currentUser: query.data, query };
};
