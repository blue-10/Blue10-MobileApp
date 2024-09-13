import type { InfiniteData, QueryKey } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import { queryKeys } from '@/constants';
import { normalizeInvoiceListItemFromResponseItem } from '@/entity/invoice/normalizer';
import type { InvoiceListItem } from '@/entity/invoice/types';
import type { PagedResults } from '@/entity/system/types';
import { convertFilterToObject, type SearchFilterMap, useSearchFilterStore } from '@/store/SearchFilterStore';
import { normalizeMap } from '@/utils/normalizerUtils';
import { useQueryKeySuffix } from '@/utils/queryUtils';

import { useApi } from '../useApi';

export type PagedInvoiceListItems = PagedResults<InvoiceListItem[]>;

type useInvoiceSearchQueryParams = {
  filters: SearchFilterMap;
  doNotSetLastFilter?: boolean;
};

export const useInvoiceSearchQuery = ({ filters, doNotSetLastFilter = false }: useInvoiceSearchQueryParams) => {
  const api = useApi();
  const setLastFilter = useSearchFilterStore((store) => store.setLastFilter);

  const queryFilter = useMemo(() => Object.fromEntries(convertFilterToObject(filters)), [filters]);
  useEffect(() => {
    if (!doNotSetLastFilter) {
      setLastFilter(filters);
    }
  }, [doNotSetLastFilter, filters, setLastFilter]);

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
        ...queryFilter,
        CurrentPage: pageParam,
        PageSize: 25,
        SortAscending: false,
        SortName: 'DocumentDate',
      });

      return {
        data: normalizeMap<InvoiceListItem>(results.data, normalizeInvoiceListItemFromResponseItem),
        paging: results.paging,
      } as PagedInvoiceListItems;
    },
    queryKey: useQueryKeySuffix([queryKeys.invoiceResults, queryFilter]),
  });

  const all = useMemo(() => (client.data ? client.data.pages.flatMap((page) => page.data) : []), [client.data]);
  const getIndexById = useCallback(
    (invoiceId: string) => {
      return all.findIndex((item) => item.id === invoiceId);
    },
    [all],
  );

  const getNextInvoice = useCallback(
    (currentInvoiceId: string): InvoiceListItem | undefined => {
      const index = getIndexById(currentInvoiceId);
      if (!(index < all.length - 1)) {
        return undefined;
      }

      return all[index + 1];
    },
    [all, getIndexById],
  );

  const getPreviousInvoice = useCallback(
    (currentInvoiceId: string): InvoiceListItem | undefined => {
      const index = getIndexById(currentInvoiceId);
      if (index < 1) {
        return undefined;
      }
      return all[index - 1];
    },
    [all, getIndexById],
  );

  return {
    all,
    client,
    getIndexById,
    getNextInvoice,
    getPreviousInvoice,
  };
};
