const { withAndroidManifest } = require('@expo/config-plugins/build/plugins/android-plugins');

function removeMediaPermissions(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    if (manifest.manifest['uses-permission']) {
      manifest.manifest['uses-permission'] = manifest.manifest['uses-permission'].filter(
        (perm) =>
          perm.$['android:name'] !== 'android.permission.READ_MEDIA_IMAGES' &&
          perm.$['android:name'] !== 'android.permission.READ_MEDIA_VIDEO' &&
          perm.$['android:name'] !== 'android.permission.READ_EXTERNAL_STORAGE',
      );
    }

    return config;
  });
}

module.exports = removeMediaPermissions;
