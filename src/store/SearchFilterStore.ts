import { create } from 'zustand';

import type { searchKeys } from '@/constants';

type SearchFilterStoreValueType = string | undefined;
type SearchFilterStoreKeyType = searchKeys;

type SearchFilterStore = {
  filters: Map<SearchFilterStoreKeyType, SearchFilterStoreValueType>;
  reset: () => void;
  setFilter: (key: SearchFilterStoreKeyType, value: SearchFilterStoreValueType) => void;
  getFilter: (key: SearchFilterStoreKeyType, defaultValue?: SearchFilterStoreValueType) => SearchFilterStoreValueType;
};

export const useSearchFilterStore = create<SearchFilterStore>((set, get) => ({
  filters: new Map(),
  getFilter: (key, defaultValue = '') => {
    const filters = get().filters;
    return filters.get(key) ?? defaultValue;
  },
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
}));
