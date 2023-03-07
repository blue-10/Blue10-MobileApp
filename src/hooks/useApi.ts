import { ApiService } from '../api/ApiService';
import { useApiStore } from '../store/ApiStore';

/**
 * Quickly get the api instance from the store.
 */
export const useApi = (): ApiService => {
  const api = useApiStore((state) => state.api);
  if (api === undefined) {
    throw Error('API store is not correctly set yet. Is the user logged in?');
  }

  return api;
};
