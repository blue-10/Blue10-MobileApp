import { useQuery } from '@tanstack/react-query';
import type React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { queryKeys } from '@/constants';
import { useApi } from '@/hooks/useApi';
import { useQueryKeySuffix } from '@/utils/queryUtils';

import type { SelectProps } from '../Select/Select';
import { Select } from '../Select/Select';

type Props = Omit<SelectProps, 'items'>;

// do not change order. TODO need translation
const itemNames = [
  'To-do',
  'Dispuut',
  'Goed te keuren',
  'Te boeken',
  'Geboekt',
  'Gearchiveerd',
  'Fout',
  'Te betalen',
  'Eerder gezien',
  'Wacht op ERP',
];

export const OverviewStatusSelect: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const api = useApi();
  const query = useQuery({
    queryFn: () => api.invoice.getOverviewStatusFilters(),
    queryKey: useQueryKeySuffix([queryKeys.overviewStatusFilters]),
  });
  const items = useMemo(() => {
    return (query.data ?? []).map((item, index) => ({
      title: t(itemNames[index]),
      value: item.toString(),
    }));
  }, [query.data, t]);

  return (
    <Select isLoading={query.isLoading} items={items} modalTitle={t('overview_status_select.modal_title')} {...props} />
  );
};
