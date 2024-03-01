import { useQuery } from '@tanstack/react-query';

import type { GetCompanyResponse } from '../../api/ApiResponses';
import { queryKeys } from '../../constants';
import { useApi } from '../useApi';

export const useAllCompanies = () => {
  const api = useApi();
  return useQuery<GetCompanyResponse>({
    queryFn: () => api.company.all(),
    queryKey: [queryKeys.companies],
  });
};
