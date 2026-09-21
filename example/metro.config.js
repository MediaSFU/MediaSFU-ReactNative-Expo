const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

// Keep the demo app's Metro project root local while resolving the SDK from the
// repository's single dependency installation.
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
].map(
	(distPath) => new RegExp(`${escapePathForRegex(distPath)}(?:[\\\\/].*)?$`),
);

const transientNativeBuildBlockList = [
	new RegExp(
		`${makeCrossPlatformPathRegex(path.resolve(projectRoot, 'android'))}${pathSeparatorPattern}\\.cxx(?:${pathSeparatorPattern}.*)?$`,
	),
	new RegExp(
		`${makeCrossPlatformPathRegex(path.resolve(projectRoot, 'android', 'app'))}${pathSeparatorPattern}\\.cxx(?:${pathSeparatorPattern}.*)?$`,
	),
	new RegExp(
		`${makeCrossPlatformPathRegex(repositoryNodeModules)}(?:${pathSeparatorPattern}.+)?${pathSeparatorPattern}android${pathSeparatorPattern}\\.cxx(?:${pathSeparatorPattern}.*)?$`,
	),
];

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// This is the Expo SDK 57 monorepo pattern: the app owns Metro's project root,
// while the SDK and its dependencies remain installed once at the repository root.
config.watchFolders = [repositoryRoot, sharedPackageSrcRoot, sharedPackageNodeModules].filter((folder) =>
	fs.existsSync(folder),
);
config.resolver.nodeModulesPaths = [repositoryNodeModules, sharedPackageNodeModules].filter((folder) =>
	fs.existsSync(folder),
);
config.resolver.blockList = [
	...sharedDistBlockList,
	...transientNativeBuildBlockList,
];
config.resolver.extraNodeModules = {
	'mediasfu-shared': sharedPackageSrcRoot,
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
	if (moduleName === 'mediasfu-shared') {
		const sharedEntry = platform === 'web' ? sharedPackageEntry : sharedPackageNativeEntry;

		return context.resolveRequest(context, sharedEntry, platform);
	}

	const resolvedModuleName = moduleName === 'event-target-shim/index'
		? 'event-target-shim'
		: moduleName;

	return context.resolveRequest(context, resolvedModuleName, platform);
};

config.server = {
	...config.server,
	enhanceMiddleware: (middleware) => {
		return (req, res, next) => {
			const requestUrl = req.url || '';
			const isBundleRequest = requestUrl.includes('.bundle');
			const acceptHeader = req.headers?.accept;

			if (isBundleRequest && typeof acceptHeader === 'string' && acceptHeader.includes('multipart/mixed')) {
				const filteredAcceptHeader = acceptHeader
					.split(',')
					.map((value) => value.trim())
					.filter((value) => value && value !== 'multipart/mixed')
					.join(', ');

				if (filteredAcceptHeader) {
					req.headers.accept = filteredAcceptHeader;
				} else {
					delete req.headers.accept;
				}
			}

			return middleware(req, res, next);
		};
	},
};

module.exports = config;
