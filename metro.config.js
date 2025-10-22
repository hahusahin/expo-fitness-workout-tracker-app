const { withNativeWind } = require("nativewind/metro");
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// Configure for mobile-only (exclude web)
config.resolver.platforms = ['ios', 'android', 'native'];

module.exports = withNativeWind(config, { input: "./src/global.css" });