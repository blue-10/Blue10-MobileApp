import { useQuery } from '@tanstack/react-query';
import type React from 'react';
import { useMemo } from 'react';

import { queryKeys } from '@/constants';
import { useGetSource } from '@/hooks/queries/useGetSource';
import { useApi } from '@/hooks/useApi';
import { useQueryKeySuffix } from '@/utils/queryUtils';

import type { SelectProps } from '../Select/Select';
import { Select } from '../Select/Select';

type Props = Omit<SelectProps, 'items'>;

// do not change order!
const itemNames = [
  'STATUS_FILTER_TODO',
  'STATUS_FILTER_AWAIT',
  'STATUS_FILTER_PENDING_APPROVAL',
  'STATUS_FILTER_TO_POST',
  'STATUS_FILTER_POSTED',
  'STATUS_FILTER_ARCHIVED',
  'STATUS_FILTER_ERROR',
  'STATUS_FILTER_PAYABLE',
  'STATUS_FILTER_INVOICES_ACTIONED_BY_USER',
  'STATUS_FILTER_WAIT_FOR_ERP',
];

export const SelectOverviewStatus: React.FC<Props> = (props) => {
  const api = useApi();

  const { data: purchaseInvoiceSource, isPending: isPurchaseInvoiceSourcePending } = useGetSource('PurchaseInvoices');
  const query = useQuery({
    queryFn: () => api.invoice.getOverviewStatusFilters(),
    queryKey: useQueryKeySuffix([queryKeys.overviewStatusFilters]),
  });

  const items = useMemo(() => {
    return (query.data ?? []).map((item, index) => ({
      title: purchaseInvoiceSource ? purchaseInvoiceSource[itemNames[index]] : itemNames[index],
      value: item.toString(),
    }));
  }, [purchaseInvoiceSource, query.data]);

  const isLoading = query.isLoading || isPurchaseInvoiceSourcePending;

  return <Select isLoading={isLoading} items={items} {...props} />;
};
