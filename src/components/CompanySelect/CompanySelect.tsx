import { useMemo } from 'react';

import { useGetAllUsers } from '@/hooks/queries/useGetAllUsers';

import { Select, type SelectProps } from '../Select/Select';

type Props = Omit<SelectProps, 'items'>;

export const CompanySelect: React.FC<Props> = ({ ...selectProps }) => {
  const { data } = useGetAllUsers();

  const items = useMemo(() => {
    return data.map((item) => ({
      title: item.name,
      value: item.id,
    }));
  }, [data]);

  return <Select items={items} {...selectProps} />;
};
