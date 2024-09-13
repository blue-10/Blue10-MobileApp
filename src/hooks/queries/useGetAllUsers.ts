import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { queryKeys } from '../../constants';
import { normalizeUserFromResponse } from '../../entity/system/normalizer';
import type { User } from '../../entity/system/types';
import { normalizeMap } from '../../utils/normalizerUtils';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

export const useGetAllUsers = () => {
  const api = useApi();

  const query = useQuery({
    queryFn: async () => normalizeMap(await api.user.getAllUsers(), normalizeUserFromResponse),
    queryKey: useQueryKeySuffix([queryKeys.users]),

    staleTime: 60 * 1000 * 10, // 5 minutes
  });

  const getUserById = useCallback(
    (id: string): User | undefined => {
      return (query.data ?? []).find((item) => item.id === id);
    },
    [query.data],
  );

  return {
    data: query.data ?? [],
    getUserById,
    query,
  };
};
