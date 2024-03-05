import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetAllUsers } from '@/hooks/queries/useGetAllUsers';

import { Select, type SelectProps } from '../Select/Select';

type Props = Omit<SelectProps, 'items'>;

export const UserSelect: React.FC<Props> = ({ ...selectProps }) => {
  const { t } = useTranslation();
  const { data } = useGetAllUsers();

  const items = useMemo(() => {
    return data.map((item) => ({
      title: item.name,
      value: item.id,
    }));
  }, [data]);

  return <Select hasSearch items={items} modalTitle={t('user_select.modal_title')} {...selectProps} />;
};
