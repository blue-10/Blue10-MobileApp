import { ExpoConfig } from '@expo/config-types';
// load .env
import * as dotenv from 'dotenv';
dotenv.config();

const getVersion = (): string => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require('./package.json');
  return packageJson.version || '0.0.0';
};

const config: ExpoConfig = {
  android: {
    adaptiveIcon: {
      backgroundColor: '#000000',
      foregroundImage: './assets/adaptive-icon.png',
    },
  },
  assetBundlePatterns: [
    '**/*',
  ],
  extra: {
    authLoginPage: process.env.AUTH_LOGIN_PAGE,
  },
  icon: './assets/icon.png',
  ios: {
    supportsTablet: true,
  },
  name: 'blue10-app',
  orientation: 'portrait',
  slug: 'blue10-app',
  splash: {
    backgroundColor: '#333333',
    image: './assets/splash.png',
    resizeMode: 'contain',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  userInterfaceStyle: 'dark',
  version: getVersion(),
};

export default config;
