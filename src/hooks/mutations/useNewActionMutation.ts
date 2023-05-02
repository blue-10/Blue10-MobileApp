import { useMutation } from '@tanstack/react-query';

import { PostNewActionParams } from '../../api/ApiRequests';
import { queryKeys } from '../../constants';
import { useApi } from '../useApi';

export const useNewActionMutation = (invoiceId: string) => {
  const api = useApi();

  return useMutation(
    [queryKeys.newAction, invoiceId],
    (params: PostNewActionParams) => api.invoice.postNewActions(params),
  );
};
