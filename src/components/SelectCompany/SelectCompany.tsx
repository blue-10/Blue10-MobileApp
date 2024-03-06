import { useMemo } from 'react';

import { useAllCompanies } from '@/hooks/queries/useAllCompanies';

import { Select, type SelectProps } from '../Select/Select';

type Props = Omit<SelectProps, 'items'>;

export const SelectCompany: React.FC<Props> = ({ ...selectProps }) => {
  const { data = [], isPending } = useAllCompanies();

  const items = useMemo(() => {
    return data.map((item) => ({
      title: item.DisplayName,
      value: item.Id,
    }));
  }, [data]);

  return <Select hasSearch isLoading={isPending} items={items} {...selectProps} />;
};
