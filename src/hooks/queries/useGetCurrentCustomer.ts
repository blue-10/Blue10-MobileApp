import { useMemo } from 'react';

import { useApi } from '../useApi';

type UseGetCurrentEnvironnmentReturn = {
  customerId?: string;
  customerName?: string;
}

export const useGetCurrentCustomer = (): UseGetCurrentEnvironnmentReturn => {
  const api = useApi();

  return useMemo(() => ({
    customerId: api.customerId,
    customerName: api.customerName,
  }),
  [api.customerName, api.customerId]);
};
