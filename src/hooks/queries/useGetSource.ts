import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { lngConvert, queryKeys } from '../../constants';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';

export type SourceType = 'PurchaseInvoices' | 'Shared'

export const useGetSource = (source: SourceType) => {
  const api = useApi();
  const { i18n } = useTranslation();
  const locale = lngConvert[i18n.language];

  return useQuery(
    useQueryKeySuffix([queryKeys.getSource, locale, source]),
    () => api.translation.getSource(locale, source),
    {
      staleTime: 60 * 1000 * 10, // 10 minutes
    },
  );
};
