const {getDefaultConfig} = require("metro-config");

module.exports = (async () => {
  const {
          resolver: {
            sourceExts, assetExts
          }
        } = await getDefaultConfig(__dirname);
  return {
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer")
    }, resolver: {
      assetExts: assetExts.filter(ext => ext !== "svg"), sourceExts: [...sourceExts, "svg"]
    }
  };
})();

// Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');
// module.exports = (() => {
//   const config = getDefaultConfig(__dirname);

//   const { 
//     transformer, 
//     resolver: {
//     assetExts,
//     sourceExts
//   } 
//   } = config;

//   config.transformer = {
//     ...transformer,
//     babelTransformerPath: require.resolve("react-native-svg-transformer"),
//   };
//   config.resolver = {
//     ...resolver,
//     assetExts: assetExts.filter((ext) => ext !== "svg"),
//     sourceExts: [...sourceExts, "svg"],
//   };

//   return config;
// })();