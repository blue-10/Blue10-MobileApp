import { useMutation } from '@tanstack/react-query';

import type { PostNewActionParams } from '../../api/ApiRequests';
import { queryKeys } from '../../constants';
import { useApi } from '../useApi';

export const useNewActionMutation = (invoiceId: string) => {
  const api = useApi();

  return useMutation({
    mutationFn: (params: PostNewActionParams) => api.invoice.postNewActions(params),
    mutationKey: [queryKeys.newAction, invoiceId],
  });
};
