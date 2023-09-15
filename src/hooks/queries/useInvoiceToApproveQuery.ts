import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { queryKeys } from '../../constants';
import { normalizeInvoiceListItemFromResponseItem } from '../../entity/invoice/normalizer';
import { InvoiceListItem } from '../../entity/invoice/types';
import { PagedResults } from '../../entity/system/types';
import { normalizeMap } from '../../utils/normalizerUtils';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

export const useInvoiceToApproveQuery = () => {
  const api = useApi();

  const client = useInfiniteQuery(
    useQueryKeySuffix([queryKeys.invoicesToApprove]),
    async ({ pageParam = 1 }) => {
      const results = await api.invoice.overview({
        CurrentPage: pageParam,
        LinkedToDocument: 0,
        PageSize: 25,
        SortAscending: false,
        SortName: 'DocumentDate',
        Status: 7,
      });

      return {
        data: normalizeMap<InvoiceListItem>(results.data, normalizeInvoiceListItemFromResponseItem),
        paging: results.paging,
      } as PagedResults<InvoiceListItem[]>;
    },
    {
      getNextPageParam: (lastPage) => lastPage.paging.next,
      getPreviousPageParam: (firstPage) => firstPage.paging.previous,
    },
  );

  const all = useMemo(() => client.data ? client.data.pages.flatMap((page) => page.data) : [], [client.data]);
  const getIndexById = useCallback((invoiceId: string) => {
    return all.findIndex((item) => item.id === invoiceId);
  }, [all]);

  return {
    all,
    client,
    getIndexById,
  };
};
