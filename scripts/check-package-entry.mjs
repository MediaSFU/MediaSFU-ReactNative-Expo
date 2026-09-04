import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
const failures = [];
for (const field of ['main', 'module', 'react-native']) {
  if (packageJson[field] !== 'dist/main.js') failures.push(`${field} must resolve to dist/main.js`);
  else if (!existsSync(path.join(packageRoot, packageJson[field]))) failures.push(`${field} target is missing`);
}
if (packageJson.type !== 'commonjs') failures.push('root package type must remain commonjs for Expo config compatibility');
const exportsRoot = packageJson.exports?.['.'];
if (exportsRoot?.import !== './dist/main.js' || exportsRoot?.default !== './dist/main.js') failures.push('exports must map import/default to ./dist/main.js');
if (exportsRoot?.require) failures.push('package does not ship a CommonJS build; remove the require export');
if (packageJson.types !== 'dist/types/main.d.ts') failures.push('types must resolve to dist/types/main.d.ts');
else if (!existsSync(path.join(packageRoot, packageJson.types))) failures.push('declaration entry is missing');
const distMetadataPath = path.join(packageRoot, 'dist', 'package.json');
if (!existsSync(distMetadataPath)) failures.push('dist/package.json is missing');
else if (JSON.parse(readFileSync(distMetadataPath, 'utf8')).type !== 'module') failures.push('dist/package.json must declare type module');
const packed = spawnSync('npm.cmd', ['pack', '--dry-run', '--json'], { cwd: packageRoot, encoding: 'utf8', windowsHide: true, shell: process.platform === 'win32' });
if (packed.status !== 0) failures.push(`npm pack --dry-run failed: ${packed.stderr?.trim() || packed.error?.message || 'no diagnostic'}`);
else {
  const files = new Set((JSON.parse(packed.stdout)[0]?.files ?? []).map((file) => file.path));
  for (const entry of ['dist/main.js', 'dist/package.json', 'dist/types/main.d.ts', 'package.json']) if (!files.has(entry)) failures.push(`packed archive omits ${entry}`);
}
console.log('MediaSFU React Native Expo package entry check');
console.log(`- Package: ${packageJson.name}@${packageJson.version}`);
console.log(`- JavaScript entry: ${packageJson.main}`);
console.log(`- Failures: ${failures.length}`);
for (const failure of failures) console.log(`- ${failure}`);
if (failures.length) process.exitCode = 1;
