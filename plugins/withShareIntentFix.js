const { withAndroidManifest } = require('@expo/config-plugins');
const { withMainActivity } = require('@expo/config-plugins/build/plugins/android-plugins');

const withShareIntentImageOnly = (config) => {
  config = withAndroidManifest(config, (modConfig) => {
    const mainActivity = modConfig.modResults.manifest.application[0].activity.find(
      (a) => a.$['android:name'] === '.MainActivity',
    );

    mainActivity['intent-filter'] = (mainActivity['intent-filter'] || []).filter(
      (f) =>
        !f.action?.some(
          (a) =>
            a.$['android:name'] === 'android.intent.action.SEND' ||
            a.$['android:name'] === 'android.intent.action.SEND_MULTIPLE',
        ),
    );

    mainActivity['intent-filter'].push({
      action: [{ $: { 'android:name': 'android.intent.action.SEND' } }],
      category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
      data: [{ $: { 'android:mimeType': 'image/*' } }],
    });
    mainActivity['intent-filter'].push({
      action: [{ $: { 'android:name': 'android.intent.action.SEND_MULTIPLE' } }],
      category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
      data: [{ $: { 'android:mimeType': 'image/*' } }],
    });

    mainActivity.$['android:exported'] = 'true';

    return modConfig;
  });

  config = withMainActivity(config, (modConfig) => {
    if (modConfig.modResults.language === 'java') return modConfig;

    let src = modConfig.modResults.contents;

    if (!src.includes('override fun onNewIntent')) {
      src = src.replace(
        /}\s*$/,
        `
    override fun onNewIntent(intent: android.content.Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
    }
}
`,
      );

      modConfig.modResults.contents = src;
    }

    return modConfig;
  });

  return config;
};

module.exports = withShareIntentImageOnly;
