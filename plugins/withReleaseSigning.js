const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Sign release builds with a private keystore when the CI environment provides
 * one. Without the secrets the release keeps the debug fallback so local
 * `expo prebuild` builds still work.
 */
module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;

    let contents = config.modResults.contents;
    if (contents.includes('ANDROID_KEYSTORE_PATH')) return config;

    contents = contents.replace(
      /signingConfigs\s*\{/,
      `signingConfigs {
        release {
            if (System.getenv("ANDROID_KEYSTORE_PATH")) {
                storeFile file(System.getenv("ANDROID_KEYSTORE_PATH"))
                storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
                keyAlias System.getenv("ANDROID_KEY_ALIAS")
                keyPassword System.getenv("ANDROID_KEY_PASSWORD")
            }
        }`,
    );

    contents = contents.replace(
      /signingConfig signingConfigs\.debug(\s+)def enableShrinkResources/,
      'signingConfig System.getenv("ANDROID_KEYSTORE_PATH") ? signingConfigs.release : signingConfigs.debug$1def enableShrinkResources',
    );

    config.modResults.contents = contents;
    return config;
  });
};
