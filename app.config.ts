import { ExpoConfig } from '@expo/config-types';

const getVersion = (): string => {
  let packageJson = require('./package.json')
  return packageJson['version'] || '0.0.0';
};

const config: ExpoConfig = {
  name: "blue10-app",
  slug: "blue10-app",
  version: getVersion(),
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#333333"
  },
  updates: {
    "fallbackToCacheTimeout": 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    "supportsTablet": true
  },
  android: {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#000000"
    }
  }
};

export default config;
