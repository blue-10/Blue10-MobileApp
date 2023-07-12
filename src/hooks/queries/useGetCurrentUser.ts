import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../constants';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

export const useGetCurrentUser = () => {
  const api = useApi();

  const query = useQuery(
    useQueryKeySuffix([queryKeys.currentUser]),
    () => api.user.getCurrentUser(),
  );

  return { currentUser: query.data, query };
};
