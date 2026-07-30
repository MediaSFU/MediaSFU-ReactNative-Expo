// Learn more https://docs.expo.io/guides/customizing-metro
const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const sharedPackageRoot = path.resolve(projectRoot, '../mediasfu-shared');
const sharedPackageSrcRoot = path.resolve(sharedPackageRoot, 'src');
const sharedPackageNodeModules = path.resolve(sharedPackageRoot, 'node_modules');
const sharedPackageEntry = path.resolve(sharedPackageSrcRoot, 'index.ts');
const sharedPackageNativeEntry = path.resolve(sharedPackageSrcRoot, 'index.native.ts');
const projectNodeModules = path.resolve(projectRoot, 'node_modules');

const escapePathForRegex = (value) =>
	value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');

const pathSeparatorPattern = String.raw`[\\/]`;

const makeCrossPlatformPathRegex = (value) =>
	value.split(path.sep).map(escapePathForRegex).join(pathSeparatorPattern);

const sharedDistBlockList = [
	path.resolve(sharedPackageRoot, 'dist'),
	path.resolve(projectNodeModules, 'mediasfu-shared', 'dist'),
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
		`${makeCrossPlatformPathRegex(projectNodeModules)}(?:${pathSeparatorPattern}.+)?${pathSeparatorPattern}android${pathSeparatorPattern}\\.cxx(?:${pathSeparatorPattern}.*)?$`,
	),
];

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

config.watchFolders = [sharedPackageSrcRoot, sharedPackageNodeModules].filter((folder) =>
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

