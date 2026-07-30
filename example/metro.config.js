const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const repositoryRoot = path.resolve(projectRoot, '..');
const repositoryNodeModules = path.resolve(repositoryRoot, 'node_modules');
const sharedPackageRoot = path.resolve(repositoryRoot, '../mediasfu-shared');
const sharedPackageSrcRoot = path.resolve(sharedPackageRoot, 'src');
const sharedPackageNodeModules = path.resolve(sharedPackageRoot, 'node_modules');
const sharedPackageEntry = path.resolve(sharedPackageSrcRoot, 'index.ts');
const sharedPackageNativeEntry = path.resolve(sharedPackageSrcRoot, 'index.native.ts');

const escapePathForRegex = (value) =>
  value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
const pathSeparatorPattern = String.raw`[\\/]`;
const makeCrossPlatformPathRegex = (value) =>
  value.split(path.sep).map(escapePathForRegex).join(pathSeparatorPattern);

const sharedDistBlockList = [
  path.resolve(sharedPackageRoot, 'dist'),
  path.resolve(repositoryNodeModules, 'mediasfu-shared', 'dist'),
].map((distPath) => new RegExp(`${escapePathForRegex(distPath)}(?:[\\\\/].*)?$`));

const transientNativeBuildBlockList = [
  new RegExp(`${makeCrossPlatformPathRegex(path.resolve(projectRoot, 'android'))}${pathSeparatorPattern}\\.cxx(?:${pathSeparatorPattern}.*)?$`),
  new RegExp(`${makeCrossPlatformPathRegex(path.resolve(projectRoot, 'android', 'app'))}${pathSeparatorPattern}\\.cxx(?:${pathSeparatorPattern}.*)?$`),
  new RegExp(`${makeCrossPlatformPathRegex(repositoryNodeModules)}(?:${pathSeparatorPattern}.+)?${pathSeparatorPattern}android${pathSeparatorPattern}\\.cxx(?:${pathSeparatorPattern}.*)?$`),
];

const config = getDefaultConfig(projectRoot);
config.watchFolders = [repositoryRoot, sharedPackageSrcRoot, sharedPackageNodeModules].filter(fs.existsSync);
config.resolver.nodeModulesPaths = [repositoryNodeModules, sharedPackageNodeModules].filter(fs.existsSync);
config.resolver.blockList = [...sharedDistBlockList, ...transientNativeBuildBlockList];
config.resolver.extraNodeModules = { 'mediasfu-shared': sharedPackageSrcRoot };
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'mediasfu-shared') {
    return context.resolveRequest(
      context,
      platform === 'web' ? sharedPackageEntry : sharedPackageNativeEntry,
      platform,
    );
  }
  return context.resolveRequest(
    context,
    moduleName === 'event-target-shim/index' ? 'event-target-shim' : moduleName,
    platform,
  );
};

module.exports = config;
