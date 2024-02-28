import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { queryKeys } from '../../constants';
import { normalizeInvoiceListItemFromResponseItem } from '../../entity/invoice/normalizer';
import { InvoiceListItem } from '../../entity/invoice/types';
import { PagedResults } from '../../entity/system/types';
import { normalizeMap } from '../../utils/normalizerUtils';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';
import { useGetCurrentUser } from './useGetCurrentUser';

type PagedInvoiceListItems = PagedResults<InvoiceListItem[]>;

export const useInvoiceToDoQuery = () => {
  const api = useApi();

  const currentUser = useGetCurrentUser();

  const client = useInfiniteQuery<
  PagedInvoiceListItems,
  Error,
  InfiniteData<PagedInvoiceListItems, number>,
  QueryKey,
  number
  >({
    getNextPageParam: (lastPage) => lastPage.paging.next,
    getPreviousPageParam: (firstPage) => firstPage.paging.previous,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const results = await api.invoice.overview({
        CurrentPage: pageParam,
        CurrentUser: [currentUser.currentUser?.Id, currentUser.currentUser?.BelongsTo]
          .filter((s) => typeof s !== 'undefined' && s !== '')
          .join(','),
        LinkedToDocument: 0,
        PageSize: 25,
        SortAscending: false,
        SortName: 'DocumentDate',
        Status: 11,
      });

      return {
        data: normalizeMap<InvoiceListItem>(results.data, normalizeInvoiceListItemFromResponseItem),
        paging: results.paging,
      } as PagedInvoiceListItems;
    },
    queryKey: useQueryKeySuffix([
      queryKeys.invoicesToDo,
      `user-${currentUser.currentUser?.Id}`,
      `belongs-to-${currentUser.currentUser?.BelongsTo}`,
    ]),
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
