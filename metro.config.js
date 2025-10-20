const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Configure for mobile-only (exclude web)
config.resolver.platforms = ['ios', 'android', 'native'];

module.exports = withNativeWind(config, { input: "./src/global.css" });
