import { useMemo } from 'react';

import { useAllCompanies } from '@/hooks/queries/useAllCompanies';

import { Select, type SelectProps } from '../Select/Select';

type Props = Omit<SelectProps, 'items'>;

export const UserSelect: React.FC<Props> = ({ ...selectProps }) => {
  const { data = [] } = useAllCompanies();

  const items = useMemo(() => {
    return data.map((item) => ({
      title: item.DisplayName,
      value: item.Id,
    }));
  }, [data]);

  return <Select items={items} {...selectProps} />;
};
