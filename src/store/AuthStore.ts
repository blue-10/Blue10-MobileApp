import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { login } from '../api/api';
import { storeKeyUserEnvironmentId, storeKeyUserProfile, storeKeyUserToken } from '../constants';

type LoggedInUser = {
  userId: string;
  name: string;
  environmentId: string;
  environmentName: string ;
}

type AuthStore = {
  isLoggedIn: boolean;
  token?: string;
  environmentId?: string;
  user?: LoggedInUser;
  doLogin: (username: string, password: string) => Promise<boolean>;
  doLogout: () => Promise<void>;
  loadFromStore: () => Promise<void>;
  setEnvironment: (environmentId: string, environmentName: string) => Promise<void>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  doLogin: async (username: string, password: string) => {
    const { token, firstName } = await login(username, password);

    const user: LoggedInUser = {
      // todo: fill in from response,
      environmentId: '39E70C9F-5521-4006-8A99-7E9700A187E5',
      environmentName: 'Omgeving 1',
      // todo: fill in from response,
      name: firstName,
      userId: '0042870B-556A-4767-AD27-6F5D7149A0AC',
    };

    await SecureStore.setItemAsync(storeKeyUserToken, token);
    await SecureStore.setItemAsync(storeKeyUserProfile, JSON.stringify(user));
    await SecureStore.setItemAsync(storeKeyUserEnvironmentId, user.environmentId);

    // set the new state
    set({
      environmentId: user.environmentId,
      isLoggedIn: true,
      token,
      user,
    });
    return true;
  },
  doLogout: async () => {
    await SecureStore.deleteItemAsync(storeKeyUserToken);
    await SecureStore.deleteItemAsync(storeKeyUserProfile);
    await SecureStore.deleteItemAsync(storeKeyUserEnvironmentId);

    set({
      isLoggedIn: false,
      token: undefined,
      user: undefined,
    });
  },
  isLoggedIn: false,
  loadFromStore: async () => {
    const token = await SecureStore.getItemAsync(storeKeyUserToken);
    const user = await SecureStore.getItemAsync(storeKeyUserProfile);
    if (token !== null && user !== null) {
      // todo: do some re authentication with new token to check if it still valid.
      const userObj = JSON.parse(user);

      set({
        environmentId: userObj.environmentId,
        isLoggedIn: true,
        token,
        user: userObj,
      });
    }
  },
  setEnvironment: async (environmentId: string, environmentName: string) => {
    const user = get().user;
    if (user) {
      user.environmentId = environmentId;
      user.environmentName = environmentName;
      set({ user });
    }
    set({ environmentId });
    await SecureStore.setItemAsync(storeKeyUserEnvironmentId, environmentId);
  },
  token: undefined,
  user: undefined,
}));

export { useAuthStore };
