import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const compiler = path.join(packageRoot, 'node_modules', 'typescript', 'bin', 'tsc');
const localRoot = path.join(packageRoot, '.local-build');
const outputRoot = path.join(localRoot, 'package-declarations');
const consumerRoot = path.join(localRoot, 'package-consumer');

for (const target of [outputRoot, consumerRoot]) {
  if (!target.startsWith(`${localRoot}${path.sep}`)) {
    throw new Error(`Refusing to clear unexpected path: ${target}`);
  }
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
}

const runCompiler = (args) => execFileSync(process.execPath, [compiler, ...args], {
  cwd: packageRoot,
  encoding: 'utf8',
  stdio: 'pipe',
  windowsHide: true,
});

runCompiler(['-p', 'tsconfig.build.json', '--noEmit', '--pretty', 'false']);
runCompiler([
  '-p', 'tsconfig.build.json',
  '--outDir', outputRoot,
  '--declarationDir', path.join(outputRoot, 'types'),
  '--pretty', 'false',
]);

const declarationFiles = [];
const visit = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(fullPath);
    else if (entry.name.endsWith('.d.ts')) declarationFiles.push(fullPath);
  }
};
visit(path.join(outputRoot, 'types'));

const forbidden = [/mediasoup-client\/lib\//, /react-native-webrtc["']\)\.default/];
for (const declarationPath of declarationFiles) {
  const source = readFileSync(declarationPath, 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(source)) {
      throw new Error(`${path.relative(packageRoot, declarationPath)} contains ${pattern}`);
    }
  }
}

const mainDeclaration = readFileSync(path.join(outputRoot, 'types', 'main.d.ts'), 'utf8');
const jsxDeclaration = readFileSync(
  path.join(outputRoot, 'types', 'src', 'types', 'react19-jsx-compat.d.ts'),
  'utf8',
);
if (!mainDeclaration.includes("import './src/types/react19-jsx-compat';")) {
  throw new Error('main.d.ts does not load the React 19 JSX compatibility declaration');
}
if (!jsxDeclaration.includes('type Element = React.JSX.Element;')) {
  throw new Error('emitted React 19 JSX declaration does not define JSX.Element');
}

writeFileSync(path.join(consumerRoot, 'index.ts'), `
import type {
  ClickAudioType,
  ClickScreenShareType,
  ClickVideoType,
  CreateDeviceClientType,
  LaunchConfirmExitType,
  Participant,
  ProcessConsumerTransportsType,
} from '../package-declarations/types/main';

export interface ExpoConsumerBoundary {
  participant: Participant;
  createDeviceClient: CreateDeviceClientType;
  clickAudio: ClickAudioType;
  clickVideo: ClickVideoType;
  processConsumerTransports: ProcessConsumerTransportsType;
  clickScreenShare: ClickScreenShareType;
  launchConfirmExit: LaunchConfirmExitType;
}
`.trimStart());
writeFileSync(path.join(consumerRoot, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: 'ES2020',
    module: 'NodeNext',
    moduleResolution: 'NodeNext',
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    jsx: 'react-jsx',
    types: ['react'],
  },
  files: ['index.ts'],
}, null, 2));
runCompiler(['-p', path.join(consumerRoot, 'tsconfig.json'), '--pretty', 'false']);

console.log('MediaSFU Expo package declaration check');
console.log('- Package source typecheck: passed');
console.log(`- Emitted declarations scanned: ${declarationFiles.length}`);
console.log('- Legacy mediasoup deep imports: none');
console.log('- React 19 JSX.Element compatibility: emitted');
console.log('- Consumer import typecheck: passed');
console.log('- Native device/runtime execution: not claimed');
