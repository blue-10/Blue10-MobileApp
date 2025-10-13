import * as dotenv from 'dotenv';
import type { ExpoConfig } from 'expo/config';
import { parse } from 'semver';
import 'ts-node/register';
import withShareIntentFix from './plugins/withShareIntentFix';
import removeMediaPermissions from './plugins/removeMediaPermissions';

dotenv.config();

const getPackageVersion = (): string => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require('./package.json');
  return packageJson.version || '0.0.0';
};

const getVersion = (): string => {
  if (process.env.RELEASE_TYPE === 'production') {
    return getPackageVersion();
  } else {
    return `${getPackageVersion()}-${process.env.EAS_BUILD_PROFILE ?? 'develop'}`;
  }
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
    return `${semver.major}.${semver.minor}.${semver.patch}${suffix}`;
  }

  return version;
};

const getVersionCode = (version: string): number => {
  const semver = parse(version);
  if (semver) {
    const isProduction = semver.prerelease.length === 0;
    // starting with 2 means production/alpha/beta app
    // starting with 1 means development app
    return (
      (isProduction ? 2 : 1) * 10000000 +
      semver.major * 1000000 +
      semver.minor * 10000 +
      semver.patch * 100 +
      (semver.prerelease.length > 1 ? Number(semver.prerelease[1]) : 0)
    );
  }

  return 1;
};

const version = getVersion();

const config: ExpoConfig = {
  android: {
    adaptiveIcon: {
      backgroundColor: '#c4d600',
      foregroundImage: './assets/adaptive-icon.png',
    },
    package: 'builders.are.we.blue10',
    versionCode: getVersionCode(version),
    intentFilters: [
      {
        action: 'SEND',
        data: [{ mimeType: 'image/*' }, { mimeType: 'application/pdf' }],
        category: ['DEFAULT', 'BROWSABLE'],
      },
      {
        action: 'SEND_MULTIPLE',
        data: [{ mimeType: 'image/*' }, { mimeType: 'application/pdf' }],
        category: ['DEFAULT', 'BROWSABLE'],
      },
    ],
  },
  assetBundlePatterns: ['**/*'],
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
    bundleIdentifier: 'com.blue10.Scanner',
    entitlements: {
      'com.apple.security.application-groups': ['group.Blue10.com'],
    },
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      CFBundleLocalizations: ['en', 'nl'],
      NSCameraUsageDescription: 'To scan documents, camera access is required.',
      NSPhotoLibraryUsageDescription: 'We need access to your photo library to choose images.',
    },
    supportsTablet: true,
  },
  name: 'Blue10',
  orientation: 'portrait',
  owner: 'blue10',
  plugins: [
    [removeMediaPermissions as any, { android: true }],
    'expo-localization',
    // disabled for now, this uploads the execution symbols to sentry. this not needed for now.
    // [
    //   '@sentry/react-native/expo',
    //   {
    //     organization: 'sentry',
    //     project: 'blue10-mobile-app',
    //     url: 'https://sentry.wecreatesolutions.nl/',
    //   },
    // ],
    'expo-secure-store',
    [
      'react-native-document-scanner-plugin',
      {
        cameraPermission: 'To scan documents, camera access is required.',
      },
    ],
    [
      'expo-media-library',
      {
        isAccessMediaLocationEnabled: true,
        photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
        savePhotosPermission: 'Allow $(PRODUCT_NAME) to save photos.',
      },
    ],
    [withShareIntentFix as any, { android: true }],
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
  version: getPackageVersion(),
};

export default config;
