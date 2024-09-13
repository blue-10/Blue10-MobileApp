import { create } from 'zustand';

import { searchKeys } from '@/constants';

export type SearchFilterStoreValueType = string | undefined;
export type SearchFilterStoreKeyType = searchKeys;

export type SearchFilterMap = Map<SearchFilterStoreKeyType, SearchFilterStoreValueType>;

type SearchFilterStore = {
  filters: SearchFilterMap;
  reset: () => void;
  setFilter: (key: SearchFilterStoreKeyType, value: SearchFilterStoreValueType) => void;
  getFilter: (key: SearchFilterStoreKeyType, defaultValue?: SearchFilterStoreValueType) => SearchFilterStoreValueType;
  lastFilter: SearchFilterMap | undefined;
  setLastFilter: (lastFilter: SearchFilterMap | undefined) => void;
};

export const useSearchFilterStore = create<SearchFilterStore>((set, get) => ({
  filters: new Map(),
  getFilter: (key, defaultValue = '') => {
    const filters = get().filters;
    return filters.get(key) ?? defaultValue;
  },
  lastFilter: undefined,
  reset: () => {
    set({ filters: new Map() });
  },
  setFilter: (key, value) => {
    set((currentState) => {
      const filters = currentState.filters;
      filters.set(key, value);
      return {
        filters,
      };
    });
  },
  setLastFilter: (lastFilter) => set({ lastFilter }),
}));

const convertToNumberValue = [searchKeys.invoiceType, searchKeys.status, searchKeys.linkedToDocument];

export const convertFilterToObject = (filters: SearchFilterMap): Map<SearchFilterStoreKeyType, string[] | any> => {
  const retValue = new Map<SearchFilterStoreKeyType, any>(filters);

  convertToNumberValue.forEach((field) => {
    if (retValue.has(field)) {
      retValue.set(field, Number.parseInt(retValue.get(field)));
    }
  });

  // fix user to be a user list
  if (retValue.has(searchKeys.userList)) {
    retValue.set(searchKeys.userList, [retValue.get(searchKeys.userList)]);
  }

  return retValue;
};
