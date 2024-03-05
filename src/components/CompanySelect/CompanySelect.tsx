import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAllCompanies } from '@/hooks/queries/useAllCompanies';

import { Select, type SelectProps } from '../Select/Select';

type Props = Omit<SelectProps, 'items'>;

export const CompanySelect: React.FC<Props> = ({ ...selectProps }) => {
  const { t } = useTranslation();
  const { data = [] } = useAllCompanies();

  const items = useMemo(() => {
    return data.map((item) => ({
      title: item.DisplayName,
      value: item.Id,
    }));
  }, [data]);

  return <Select hasSearch items={items} modalTitle={t('company_select.modal_title')} {...selectProps} />;
};
