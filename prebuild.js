(async () => {
	const fs = typeof require === 'function'
		? require('fs')
		: (await import('node:fs')).default;

	const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

	// Set the package to point at the built output during the build pipeline.
	packageJson.main = 'dist/main.js';
	packageJson.type = 'module';

	fs.writeFileSync('package.json', `${JSON.stringify(packageJson, null, 2)}\n`, 'utf-8');
	console.log('Updated package.json main entry to dist/main.js for build');
})();
