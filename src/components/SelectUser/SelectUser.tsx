import { useMemo } from 'react';

import { useGetAllUsers } from '@/hooks/queries/useGetAllUsers';

import { Select, type SelectProps } from '../Select/Select';

type Props = Omit<SelectProps, 'items'>;

export const SelectUser: React.FC<Props> = ({ ...selectProps }) => {
  const {
    data,
    query: { isPending },
  } = useGetAllUsers();

  const items = useMemo(() => {
    return data.map((item) => ({
      title: item.name,
      value: item.id,
    }));
  }, [data]);

  return <Select hasSearch isLoading={isPending} items={items} {...selectProps} />;
};
