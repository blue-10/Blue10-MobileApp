import { useIsFetching } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback } from 'react';

import { PostNewActionParams } from '../../api/ApiRequests';
import { queryKeys } from '../../constants';
import { useInvalidateInvoice } from '../../hooks/invalidate/useInvalidateInvoice';
import { useNewActionMutation } from '../../hooks/mutations/useNewActionMutation';
import { useGetSource } from '../../hooks/queries/useGetSource';
import { useInvoiceDetails } from '../../hooks/queries/useInvoiceDetails';
import { useActionIdToText } from '../../hooks/useActionIdToText';
import { useInvoiceActionFormStore } from '../../store/InvoiceActionFormStore';
import { useAddToast } from '../Toast/useToast';

// small remap of error not returned correctly.
const errorRemap: Record<string, string> = {
  REQUIRED_NEXT_USER_ID: 'REQUIRED_NEXT_USER',
};

export const useInvoiceActionFormSubmit = (invoiceId: string) => {
  const { data: purchaseInvoiceSource } = useGetSource('PurchaseInvoices');
  const newActionMutation = useNewActionMutation(invoiceId);
  const invoiceActionStore = useInvoiceActionFormStore();
  const invalidateInvoice = useInvalidateInvoice();
  const actionIdToText = useActionIdToText();
  const addToast = useAddToast();
  const {
    data: item,
    isFetching: isFetchingInvoice,
    refetch: refetchInvoice,
  } = useInvoiceDetails(invoiceId);

  const isFetchingInvoiceActions = useIsFetching({
    queryKey: [queryKeys.invoiceActions, invoiceId],
  });

  const getMessageFromKey = useCallback((errorMessage: string) => {
    let retValue = errorMessage;
    let messageKey = retValue.toUpperCase();
    if (messageKey in errorRemap) {
      messageKey = errorRemap[messageKey];
    }

    if ((messageKey !== '') && (purchaseInvoiceSource) && (messageKey in purchaseInvoiceSource)) {
      retValue = purchaseInvoiceSource[messageKey];
    }

    return retValue;
  }, [purchaseInvoiceSource]);

  const submit = useCallback(async () => {
    if (!item) {
      return;
    }
    const params: PostNewActionParams = {
      AutoRouteId: '',
      CurrentUserId: item.currentUserId,
      DocumentId: invoiceId,
      DocumentType: 1,
      LastInvoiceUpdate: item.lastUpdate,
      NextAction: invoiceActionStore.selectedActionId ?? 0,
      NextUserId: invoiceActionStore.selectedUserId,
      PreviousAction: item.lastActionId,
      PreviousStatus: item.statusId,
      Remark: invoiceActionStore.comment,
      RouteId: '00000000-0000-0000-0000-000000000000',
      RouteOption: 0,
    };
    try {
      const result = await newActionMutation.mutateAsync(params);
      addToast(
        getMessageFromKey(result).replace('{0}', actionIdToText(invoiceActionStore.selectedActionId ?? -1)),
        2500,
      );
      invoiceActionStore.reset();
      invalidateInvoice(invoiceId);
      await refetchInvoice(); // refetch invoice
    } catch (err) {
      if (err instanceof AxiosError) {
        addToast(getMessageFromKey((err.response?.data.Message ?? '')));
      }
    }
  }, [
    item,
    invoiceId,
    invalidateInvoice,
    invoiceActionStore,
    newActionMutation,
    actionIdToText,
    addToast,
    getMessageFromKey,
    refetchInvoice,
  ]);

  const isSubmitDisabled = (isFetchingInvoiceActions > 0) || isFetchingInvoice || newActionMutation.isLoading;

  return {
    isMutating: newActionMutation.isLoading,
    isSubmitDisabled,
    submit,
  };
};
