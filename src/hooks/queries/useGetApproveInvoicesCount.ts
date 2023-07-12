import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { queryKeys, queryRefetchInterval } from '../../constants';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import { useApi } from '../useApi';
import { useAllCompanies } from './useAllCompanies';

const DASHBOARD_APPROVED_INVOICE_NAME = 5;
const DASHBOARD_APPRIVED_RULE_STATUS = 0;
const DASHBOARD_APPRIVED_STEP_STATUS = 40;

export const useGetApprovedInvoiceCount = () => {
  const api = useApi();
  const allCompaniesQuery = useAllCompanies();

  const companyIds = useMemo(
    () => {
      if (!allCompaniesQuery.data) {
        return [];
      }
      return allCompaniesQuery.data.map((item) => item.Id);
    },
    [allCompaniesQuery.data],
  );

  const dashboardQuery = useQuery(
    useQueryKeySuffix([queryKeys.totalInvoices]),
    () => api.dashboard.get(
      {
        CompanyIds: companyIds,
        DocumentTypes: [1, 2, 3],
      },
    ),
    {
      enabled: (companyIds.length > 0),
      refetchInterval: queryRefetchInterval.totalInvoices,
    },
  );
  const count = useMemo(() => {
    const mainFilter = (dashboardQuery.data ?? []).filter((item) => item.Name === DASHBOARD_APPROVED_INVOICE_NAME);
    const subItems = (mainFilter.length > 0) ? mainFilter[0].DashboardSubItems : [];
    const subItemsFiltered = subItems.filter(
      (item) =>
        item.RuleStatus === DASHBOARD_APPRIVED_RULE_STATUS && item.StepStatus === DASHBOARD_APPRIVED_STEP_STATUS,
    );

    return subItemsFiltered.reduce((prevValue, value) => prevValue + value.Count, 0);
  }, [dashboardQuery.data]);

  return { count, isLoading: dashboardQuery.isLoading || allCompaniesQuery.isLoading };
};
