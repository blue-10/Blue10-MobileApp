import { useMemo } from 'react';

import { useAllCompanies } from '@/hooks/queries/useAllCompanies';

import { Select, type SelectProps } from '../Select/Select';

type Props = Omit<SelectProps, 'items'>;

const data = [
  { id: 'DateDesc', name: 'Date (Desc)' },
  { id: 'DateAsc', name: 'Date (Asc)' },
  { id: 'InvoiceNrDesc', name: 'InvoiceNr (Desc)' },
  { id: 'InvoiceNrAsc', name: 'InvoiceNr (Asc)' },
  { id: 'DueDateDesc', name: 'DueDate (Desc)' },
  { id: 'DueDateAsc', name: 'DueDate (Asc)' },
  { id: 'VendorDesc', name: 'Vendor (Desc)' },
  { id: 'VendorAsc', name: 'Vendor (Asc)' },
];

export const SelectSearchOrder: React.FC<Props> = ({ ...selectProps }) => {
  const items = useMemo(() => {
    return data.map((item) => ({
      title: item.name,
      value: item.id,
    }));
  }, [data]);

  return <Select items={items} {...selectProps} />;
};
