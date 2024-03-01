import { useApi } from '../hooks/useApi';

/**
 * Adds a suffix of the api baseurl to query keys.
 * This is to make sure that when switching the environment the correct api is called.
 */
export const useQueryKeySuffix = (querykeys: string[]) => {
  const api = useApi();
  return [...querykeys, api.baseUrl];
};
