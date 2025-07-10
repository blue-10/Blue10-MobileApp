const { withMainActivity } = require('@expo/config-plugins/build/plugins/android-plugins');

const withShareIntentFix = (config) => {
  return withMainActivity(config, (config) => {
    if (config.modResults.language === 'java') return config;

    let src = config.modResults.contents;

    if (!src.includes('override fun onNewIntent')) {
      src = src.replace(
        /}\s*$/,
        `
    override fun onNewIntent(intent: android.content.Intent?) {
        super.onNewIntent(intent)
        setIntent(intent)
    }
}
`,
      );

      config.modResults.contents = src;
    }

    return config;
  });
};

module.exports = withShareIntentFix;
