import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../constants';
import { useApi } from '../useApi';

export const useGetCurrentUser = () => {
  const api = useApi();
  const query = useQuery(
    [queryKeys.currentUser],
    () => api.user.getCurrentUser(),
  );

  return { currentUser: query.data, query };
};
