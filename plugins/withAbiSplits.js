const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Emit one APK per CPU architecture plus a universal fallback. Shipping a
 * single ARM APK roughly halves the download compared with the combined APK.
 */
module.exports = function withAbiSplits(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;

    let contents = config.modResults.contents;
    if (contents.includes('splits {')) return config;

    contents = contents.replace(
      /^android\s*\{/m,
      `android {
    splits {
        abi {
            enable true
            reset()
            include "armeabi-v7a", "arm64-v8a"
            universalApk true
        }
    }`,
    );

    config.modResults.contents = contents;
    return config;
  });
};
