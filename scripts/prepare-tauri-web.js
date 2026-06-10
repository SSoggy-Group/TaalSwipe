const { execFileSync } = require('node:child_process');
const { readFileSync, readdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const dist = join(root, 'dist');
const expoCli = join(root, 'node_modules', 'expo', 'bin', 'cli');

execFileSync(process.execPath, [expoCli, 'export', '--platform', 'web'], {
  cwd: root,
  stdio: 'inherit',
});

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(dist)) {
  if (!file.endsWith('.html') && !file.endsWith('.js')) continue;

  const original = readFileSync(file, 'utf8');
  const patched = original
    .replaceAll('href="/', 'href="./')
    .replaceAll('src="/', 'src="./')
    .replaceAll('"/_expo/', '"./_expo/')
    .replaceAll('"/assets/', '"./assets/')
    .replaceAll('uri:"/assets/', 'uri:"./assets/');

  if (patched !== original) {
    writeFileSync(file, patched);
  }
}
