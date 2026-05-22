(async () => {
	const fs = typeof require === 'function'
		? require('fs')
		: (await import('node:fs')).default;

	const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

	// Restore package metadata after the build artifacts are produced.
	packageJson.main = 'index.tsx';
	packageJson.type = 'commonjs';

	fs.writeFileSync('package.json', `${JSON.stringify(packageJson, null, 2)}\n`, 'utf-8');
})();

