const path = require('path');
const { expo: baseConfig } = require('../app.json');

const fromRepositoryRoot = (filePath) => path.resolve(__dirname, '..', filePath);

const plugins = baseConfig.plugins.map((plugin) => {
  if (!Array.isArray(plugin)) {
    return plugin;
  }

  const [name, options] = plugin;

  if (name === 'expo-splash-screen') {
    return [name, { ...options, image: fromRepositoryRoot('assets/logo512.png') }];
  }

  if (name === './plugins/withMediaSFUWebRTC') {
    return [require.resolve('../plugins/withMediaSFUWebRTC'), options];
  }

  return plugin;
});

module.exports = () => ({
  ...baseConfig,
  icon: fromRepositoryRoot('assets/logo512.png'),
  android: {
    ...baseConfig.android,
    adaptiveIcon: {
      ...baseConfig.android.adaptiveIcon,
      foregroundImage: fromRepositoryRoot('assets/logo512.png'),
    },
  },
  plugins,
});
