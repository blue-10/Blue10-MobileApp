import { useMemo } from 'react';

import type { SearchFilterMap, SearchFilterStoreKeyType, SearchFilterStoreValueType } from '@/store/SearchFilterStore';

import { searchKeys } from '../../constants';
import { useGetCurrentUser } from './useGetCurrentUser';
import { useInvoiceSearchQuery } from './useInvoiceSearchQuery';

export const useInvoiceToDoQuery = () => {
  const currentUser = useGetCurrentUser();

  const filters: SearchFilterMap = useMemo(() => {
    const retValue = new Map<SearchFilterStoreKeyType, SearchFilterStoreValueType>();
    retValue.set(
      searchKeys.currentUser,
      [currentUser.currentUser?.Id, currentUser.currentUser?.BelongsTo]
        .filter((s) => typeof s !== 'undefined' && s !== '')
        .join(','),
    );
    retValue.set(searchKeys.linkedToDocument, '0');
    retValue.set(searchKeys.status, '11');
    return retValue;
  }, [currentUser.currentUser?.BelongsTo, currentUser.currentUser?.Id]);

  return useInvoiceSearchQuery({ filters });
};
