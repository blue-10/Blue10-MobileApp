import type { InfiniteData, QueryKey } from '@tanstack/react-query';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { GetInvoiceImageResponse } from '../../api/ApiResponses';
import { queryKeys } from '../../constants';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

type InfiniteQueryResult = {
  data: GetInvoiceImageResponse;
  nextPage?: number;
  previousPage?: number;
};

export const useInvoiceGetImages = (id: string) => {
  const api = useApi();
  const imageCountQuery = useQuery({
    queryFn: () => api.invoice.getImageCount(id),
    queryKey: useQueryKeySuffix([queryKeys.invoiceImageCount, id]),
  });
  const imageCount = useMemo(() => imageCountQuery.data ?? 0, [imageCountQuery.data]);

  const imagesQuery = useInfiniteQuery<
    InfiniteQueryResult,
    Error,
    InfiniteData<InfiniteQueryResult, number>,
    QueryKey,
    number
  >({
    getNextPageParam: (lastPage) => lastPage.nextPage,
    getPreviousPageParam: (lastPage) => lastPage.previousPage,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const data = await api.invoice.getImage(id, pageParam);
      return {
        data,
        nextPage: !(pageParam + 1 > imageCount) ? pageParam + 1 : undefined,
        previousPage: !(pageParam <= 1) ? pageParam - 1 : undefined,
      };
    },
    queryKey: useQueryKeySuffix([queryKeys.invoiceImages, id]),
  });

  const images = useMemo(
    () =>
      (imagesQuery.data?.pages ?? [])
        .flatMap((page) => page.data)
        .map((item) => `data:image/jpeg;base64,${item.Image}`),
    [imagesQuery.data],
  );

  return {
    imageCount,
    imageCountQuery,
    images,
    imagesQuery,
  };
};
