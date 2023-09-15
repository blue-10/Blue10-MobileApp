import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { queryKeys } from '../../constants';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

export const useInvoiceGetImages = (id: string) => {
  const api = useApi();
  const imageCountQuery = useQuery(
    useQueryKeySuffix([queryKeys.invoiceImageCount, id]),
    () => api.invoice.getImageCount(id),
  );
  const imageCount = useMemo(() => imageCountQuery.data ?? 0, [imageCountQuery.data]);

  const imagesQuery = useInfiniteQuery(
    useQueryKeySuffix([queryKeys.invoiceImages, id]),
    async ({ pageParam = 1 }) => {
      // const data = await api.invoice.getImage(id, pageParam);
      const data = await api.invoice.getImage(id, 1);
      return {
        data,
        nextPage: (!((pageParam + 1) > imageCount)) ? pageParam + 1 : undefined,
        previousPage: (!(pageParam <= 1)) ? pageParam - 1 : undefined,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      getPreviousPageParam: (lastPage) => lastPage.previousPage,
    },
  );

  const images = useMemo(() => (imagesQuery.data?.pages ?? []).flatMap((page) => page.data)
    .map((item) => `data:image/jpeg;base64,${item.Image}`)
  , [imagesQuery.data]);

  return {
    imageCount,
    imageCountQuery,
    images,
    imagesQuery,
  };
};
