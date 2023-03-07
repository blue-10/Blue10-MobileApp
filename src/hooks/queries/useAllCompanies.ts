import { useQuery } from '@tanstack/react-query';

import { GetCompanyResponse } from '../../api/ApiResponses';
import { queryKeys } from '../../constants';
import { useApi } from '../useApi';

export const useAllCompanies = () => {
  const api = useApi();
  return useQuery<GetCompanyResponse>(
    [queryKeys.companies],
    () => api.company.all(),
  );
};
