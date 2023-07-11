import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { ApiService } from '../api/ApiService';
import { storeKeyBaseUrl, storeKeyRefreshToken } from '../constants';

type ApiStore = {
  api?: ApiService;
  baseUrl?: string;
  refreshToken?: string;
  hasRefreshToken: boolean;
  refreshTokenValidUntil?: Date;
  setBaseUrlAndRefreshToken: (refreshToken: string, baseUrl: string) => Promise<void>;
  loadRefreshTokenFromStore: () => Promise<void>;
  getNewRefreshToken: () => Promise<boolean>;
  clearRefreshToken: () => Promise<void>;
};

const useApiStore = create<ApiStore>((set, get) => ({
  api: undefined,
  baseUrl: undefined,
  clearRefreshToken: async () => {
    // delete items from SecureStore
    await SecureStore.deleteItemAsync(storeKeyRefreshToken);
    await SecureStore.deleteItemAsync(storeKeyBaseUrl);

    // reset state
    set({
      api: undefined,
      baseUrl: undefined,
      hasRefreshToken: false,
      refreshToken: undefined,
      refreshTokenValidUntil: undefined,
    });

    return Promise.resolve();
  },
  getNewRefreshToken: async() => {
    if (!get().api) {
      return false;
    }

    const api = get().api;
    if (api?.canGetNewRefreshToken()) {
      try {
        const data = await api.requestNewRefreshToken();
        get().setBaseUrlAndRefreshToken(data.Token, api.baseUrl);

        return true;
      } catch (err) {
        // failed to get request, we cannot get a refresh token. logout and clear the store
        get().clearRefreshToken();
      }
    } else { // cannot get a new refresh token.
      get().clearRefreshToken();
    }

    return false;
  },
  hasRefreshToken: false,
  loadRefreshTokenFromStore: async () => {
    // get items from SecureStore
    const baseUrl = await SecureStore.getItemAsync(storeKeyBaseUrl);
    const refreshToken = await SecureStore.getItemAsync(storeKeyRefreshToken);

    if (baseUrl !== null && refreshToken !== null) {
      const newApi = new ApiService(baseUrl, refreshToken);
      // check if refresh token is still valid
      if (!newApi.isRefreshTokenStillValid()) {
        return;
      }

      get().setBaseUrlAndRefreshToken(refreshToken, baseUrl);
    }
  },
  refreshTokenValidUntil: undefined,
  setBaseUrlAndRefreshToken: async (refreshToken: string, baseUrl: string) => {
    const newApi = new ApiService(baseUrl, refreshToken);

    // save refresh token to store;
    await SecureStore.setItemAsync(storeKeyRefreshToken, refreshToken);
    await SecureStore.setItemAsync(storeKeyBaseUrl, baseUrl);

    // set state
    set({
      api: newApi,
      baseUrl,
      hasRefreshToken: true,
      refreshToken,
      refreshTokenValidUntil: newApi.getRefreshTokenExpireDate(),
    });
  },
}));

export { useApiStore };
