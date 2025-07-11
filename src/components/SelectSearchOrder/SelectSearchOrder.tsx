import { useMemo } from 'react';

import { useAllCompanies } from '@/hooks/queries/useAllCompanies';

import { Select, type SelectProps } from '../Select/Select';
import { t } from 'i18next';

type Props = Omit<SelectProps, 'items'>;

export const SelectSearchOrder: React.FC<Props> = ({ ...selectProps }) => {
  const data = useMemo(
    () => [
      { id: 'D_DocumentDate', name: t('search_filter.order_items.date_desc') },
      { id: 'A_DocumentDate', name: t('search_filter.order_items.date_asc') },
      { id: 'D_DocumentNumber', name: t('search_filter.order_items.invoiceNR_desc') },
      { id: 'A_DocumentNumber', name: t('search_filter.order_items.invoiceNR_asc') },
      { id: 'D_DueDate', name: t('search_filter.order_items.dueDate_desc') },
      { id: 'A_DueDate', name: t('search_filter.order_items.dueDate_asc') },
      { id: 'D_RelationName', name: t('search_filter.order_items.vendor_desc') },
      { id: 'A_RelationName', name: t('search_filter.order_items.vendor_asc') },
    ],
    [t],
  );
  const items = useMemo(() => {
    return data.map((item) => ({
      title: item.name,
      value: item.id,
    }));
  }, [data]);

  return <Select items={items} {...selectProps} />;
};
