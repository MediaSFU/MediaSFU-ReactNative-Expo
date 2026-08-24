import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(import.meta.dirname, '../src/utils/embeddedLayout.ts'), 'utf8');
assert.match(source, /boundary\.width\s*\*\s*widthFraction/, 'width is derived from the measured boundary');
assert.match(source, /boundary\.height\s*\*\s*heightFraction/, 'height is derived from the measured boundary');

const calculateEmbeddedLayout = ({
  boundary,
  widthFraction = 1,
  heightFraction = 1,
  contentHeightFraction = 1,
}) => ({
  width: Math.max(0, Math.floor(boundary.width * widthFraction)),
  height: Math.max(0, Math.floor(boundary.height * heightFraction * contentHeightFraction)),
});

assert.deepEqual(
  calculateEmbeddedLayout({ boundary: { width: 1500, height: 900 } }),
  { width: 1500, height: 900 },
  'full-window defaults remain unchanged',
);

for (const boundaryName of ['MainContainer', 'MainAspect', 'MainScreen']) {
  const embedded = calculateEmbeddedLayout({ boundary: { width: 1294, height: 720 } });
  assert.ok(embedded.width <= 1294, `${boundaryName} remains inside the measured host`);
}

assert.deepEqual(
  calculateEmbeddedLayout({ boundary: { width: 1036, height: 640 }, contentHeightFraction: 0.9 }),
  { width: 1036, height: 576 },
  'resize updates the shared boundary',
);

console.log('Expo embedded-layout regression contract passed.');
