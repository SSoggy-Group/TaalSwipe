const { execFileSync } = require('node:child_process');
const { readFileSync, readdirSync, writeFileSync, copyFileSync, cpSync, existsSync, statSync } = require('node:fs');
const { join, extname, relative, sep } = require('node:path');

const root = join(__dirname, '..');
const dist = join(root, 'dist');
const publicDir = join(root, 'public');
const expoCli = join(root, 'node_modules', 'expo', 'bin', 'cli');

execFileSync(process.execPath, [expoCli, 'export', '--platform', 'web'], {
  cwd: root,
  stdio: 'inherit',
});

// Copy PWA files from public to dist. Directories are copied recursively so
// nested assets keep their structure and an empty destination is created.
if (existsSync(publicDir)) {
  for (const file of readdirSync(publicDir)) {
    const src = join(publicDir, file);
    const dest = join(dist, file);
    const stat = statSync(src);
    if (stat.isFile()) {
      copyFileSync(src, dest);
    } else if (stat.isDirectory()) {
      cpSync(src, dest, { recursive: true });
    }
  }
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(dist)) {
  if (!file.endsWith('.html') && !file.endsWith('.js')) continue;

  const original = readFileSync(file, 'utf8');
  let patched = original
    .replaceAll('href="/', 'href="./')
    .replaceAll('src="/', 'src="./')
    .replaceAll('"/_expo/', '"./_expo/')
    .replaceAll('"/assets/', '"./assets/')
    .replaceAll('uri:"/assets/', 'uri:"./assets/');

  // Inject PWA meta tags and web-native CSS into index.html
  if (file.endsWith('index.html')) {
    // More robust replacement - find the closing </head> or the favicon link
    if (patched.includes('<link rel="icon" href="./favicon.ico" />')) {
      patched = patched.replace(
        '<link rel="icon" href="./favicon.ico" />',
        `<link rel="icon" href="./favicon.ico" />
    <link rel="manifest" href="./manifest.json" />
    <meta name="theme-color" content="#1F4E79" />
    <meta name="description" content="Swipe through Dutch language challenges, build streaks, and improve spelling, grammar, slang, and brand-name knowledge." />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="TaalSwipe" />
    <link rel="apple-touch-icon" href="./assets/icon-180.png" />
    <link rel="stylesheet" href="./web-native.css" />`
      );
    } else if (patched.includes('</head>')) {
      // Fallback: inject before </head>
      patched = patched.replace(
        '</head>',
        `    <link rel="manifest" href="./manifest.json" />
    <meta name="theme-color" content="#1F4E79" />
    <meta name="description" content="Swipe through Dutch language challenges, build streaks, and improve spelling, grammar, slang, and brand-name knowledge." />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="TaalSwipe" />
    <link rel="apple-touch-icon" href="./assets/icon-180.png" />
    <link rel="stylesheet" href="./web-native.css" />
  </head>`
      );
    }
  }

  if (patched !== original) {
    writeFileSync(file, patched);
  }
}

// Generate the list of files the service worker precaches. This includes the
// hashed startup bundle, so a first offline launch can still boot the app.
const PRECACHE_EXTENSIONS = new Set([
  '.html', '.js', '.css', '.json', '.png', '.ico', '.svg',
  '.ttf', '.otf', '.woff', '.woff2', '.wav', '.mp3',
]);

const precacheFiles = walk(dist)
  .filter((file) => {
    const relativePath = relative(dist, file).split(sep).join('/');
    if (relativePath === 'sw.js' || relativePath === 'precache-manifest.json') return false;
    return PRECACHE_EXTENSIONS.has(extname(file).toLowerCase());
  })
  .map((file) => `./${relative(dist, file).split(sep).join('/')}`)
  .sort();

writeFileSync(join(dist, 'precache-manifest.json'), JSON.stringify(precacheFiles));
