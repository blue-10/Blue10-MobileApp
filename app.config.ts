import { ExpoConfig } from '@expo/config-types';
// load .env
import * as dotenv from 'dotenv';
import { parse } from 'semver';
dotenv.config();

const getVersion = (): string => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require('./package.json');
  return packageJson.version || '0.0.0';
};

const getBuildNumber = (version: string): string => {
  const semver = parse(version);
  if (semver) {
    let suffix = '';
    if (semver.prerelease.length > 1) {
      const preReleaseName = semver.prerelease[0];
      const preReleaseVersion = semver.prerelease[1];

      switch (preReleaseName) {
        case 'develop':
          suffix = `.1${preReleaseVersion}`;
          break;
        case 'staging':
        case 'acceptance':
        case 'release':
          suffix = `.2${preReleaseVersion}`;
          break;
      }
    }
    return `${semver.major}.${semver.minor}.${semver.patch}` + suffix;
  }

  return version;
};

const version = getVersion();

const config: ExpoConfig = {
  android: {
    adaptiveIcon: {
      backgroundColor: '#c4d600',
      foregroundImage: './assets/adaptive-icon.png',
    },
    package: 'builders.are.we.blue10',
  },
  assetBundlePatterns: [
    '**/*',
  ],
  developmentClient: {
    silentLaunch: true,
  },
  extra: {
    authLoginPage: process.env.AUTH_LOGIN_PAGE,
    eas: {
      projectId: 'eb428ba3-923b-4b72-bdcd-7ab92d0e0321',
    },
  },
  icon: './assets/icon.png',
  ios: {
    buildNumber: getBuildNumber(version),
    bundleIdentifier: 'blue10.InvoiceManagement',
    infoPlist: {
      CFBundleLocalizations: ['en', 'nl'],
    },
    supportsTablet: true,
  },
  name: 'Blue10',
  orientation: 'portrait',
  owner: 'blue10',
  plugins: [
    'sentry-expo',
    ['react-native-document-scanner-plugin', {
      cameraPermission: 'To scan documents, camera access is required.',
    }],
  ],
  slug: 'blue10-app',
  splash: {
    backgroundColor: '#333333',
    image: './assets/splash.png',
    resizeMode: 'contain',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  userInterfaceStyle: 'light',
  version: getVersion(),
};

export default config;
