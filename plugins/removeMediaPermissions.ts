import type { ConfigPlugin } from '@expo/config-plugins';
import { withAndroidManifest } from '@expo/config-plugins/build/plugins/android-plugins';

const removeMediaPermissions: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    if (manifest.manifest['uses-permission']) {
      manifest.manifest['uses-permission'] = manifest.manifest['uses-permission'].filter(
        (perm: any) =>
          perm.$['android:name'] !== 'android.permission.READ_MEDIA_IMAGES' &&
          perm.$['android:name'] !== 'android.permission.READ_MEDIA_VIDEO' &&
          perm.$['android:name'] !== 'android.permission.READ_EXTERNAL_STORAGE'
      );
    }

    return config;
  });
};

export default removeMediaPermissions;

