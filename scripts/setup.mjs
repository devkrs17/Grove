#!/usr/bin/env node
// One-command bootstrap for Grove, written for people who have never coded.
// It checks your tools, writes your local config, starts the database, and
// installs everything. It does NOT change any of your existing files.
//
// Run it with:  pnpm setup

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const isWin = process.platform === 'win32';
const rel = (p) => relative(root, p) || '.';

// --- tiny, dependency-free output helpers ---
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m',
};
const log = (m = '') => console.log(m);
const title = (m) => log(`\n${C.bold}${C.cyan}${m}${C.reset}`);
const ok = (m) => log(`  ${C.green}OK${C.reset}   ${m}`);
const warn = (m) => log(`  ${C.yellow}NOTE${C.reset} ${m}`);
const bad = (m) => log(`  ${C.red}STOP${C.reset} ${m}`);
const hint = (m) => log(`       ${C.dim}${m}${C.reset}`);

// Run a command and stream its output to the screen.
function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: isWin });
  return r.status === 0;
}

// Check whether a command exists and works, quietly.
function works(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: 'ignore', shell: isWin });
  return r.status === 0;
}

function exitWith(message) {
  log();
  bad(message);
  log(`\n${C.dim}Fix the item above, then run ${C.reset}${C.bold}pnpm setup${C.reset}${C.dim} again.${C.reset}\n`);
  process.exit(1);
}

log(`\n${C.bold}Grove setup${C.reset} ${C.dim}— getting your computer ready to run the project${C.reset}`);

// ---------------------------------------------------------------------------
title('Step 1 of 4  Checking the tools you need');

// Node.js — this script is already running in Node, so just check the version.
const nodeMajor = Number(process.versions.node.split('.')[0]);
if (Number.isNaN(nodeMajor) || nodeMajor < 20) {
  bad(`Node.js 20 or newer is required (you have ${process.version}).`);
  hint('Download the "LTS" version from https://nodejs.org and install it, then try again.');
  process.exit(1);
}
ok(`Node.js ${process.version}`);

// pnpm — the package manager this project uses.
if (!works('pnpm', ['--version'])) {
  bad('pnpm is not installed. It is the tool that downloads the project\'s code libraries.');
  hint('Install it by running:  npm install -g pnpm');
  hint('(npm comes with Node.js, so this should work right away.)');
  process.exit(1);
}
ok('pnpm is installed');

// Docker — runs the PostgreSQL database the app needs.
if (!works('docker', ['--version'])) {
  bad('Docker is not installed. It runs the database (PostgreSQL) the app stores data in.');
  hint('Install "Docker Desktop" from https://www.docker.com/products/docker-desktop');
  hint('After installing, open Docker Desktop once so it can finish starting up.');
  process.exit(1);
}
if (!works('docker', ['info'])) {
  bad('Docker is installed but not running.');
  hint('Open the Docker Desktop app and wait for it to say "Running", then try again.');
  process.exit(1);
}
ok('Docker is installed and running');

// ---------------------------------------------------------------------------
title('Step 2 of 4  Writing your local config files');
hint('These hold local-only settings. Existing files are never overwritten.');

// One shared secret so the app and the CMS agree on it.
const secret = randomBytes(32).toString('hex');

function ensureEnv(examplePath, targetPath) {
  if (existsSync(targetPath)) {
    warn(`${rel(targetPath)} already exists — leaving it as-is`);
    return;
  }
  if (!existsSync(examplePath)) {
    warn(`Could not find ${rel(examplePath)} to copy from — skipping`);
    return;
  }
  const filled = readFileSync(examplePath, 'utf8')
    .replace(/^PAYLOAD_SECRET=.*$/m, `PAYLOAD_SECRET=${secret}`);
  writeFileSync(targetPath, filled);
  ok(`Created ${rel(targetPath)} (with a fresh, random PAYLOAD_SECRET)`);
}

ensureEnv(join(root, '.env.example'), join(root, '.env.local'));
ensureEnv(join(root, 'apps', 'cms', '.env.example'), join(root, 'apps', 'cms', '.env.local'));
hint('Auth0 login values are left blank — the apps still start, but sign-in features stay off until you fill them in.');

// ---------------------------------------------------------------------------
title('Step 3 of 4  Starting the database');
const compose = works('docker', ['compose', 'version'])
  ? ['docker', ['compose', 'up', '-d']]
  : works('docker-compose', ['--version'])
    ? ['docker-compose', ['up', '-d']]
    : null;
if (!compose) {
  exitWith('Docker Compose was not found. Update Docker Desktop to the latest version and try again.');
}
if (!run(compose[0], compose[1])) {
  exitWith('The database failed to start. Make sure Docker Desktop is running, then try again.');
}
ok('PostgreSQL is running in the background (it will keep running until you stop it)');

// ---------------------------------------------------------------------------
title('Step 4 of 4  Installing the project\'s code libraries');
hint('First run downloads a lot and can take a few minutes. Later runs are fast.');
if (!run('pnpm', ['install'])) {
  exitWith('Installing dependencies failed. Check your internet connection and try again.');
}
ok('All dependencies installed');

// ---------------------------------------------------------------------------
log(`\n${C.green}${C.bold}Done — your computer is ready to run Grove.${C.reset}\n`);
log(`${C.bold}Start the app with:${C.reset}  ${C.cyan}pnpm dev${C.reset}`);
log('Then open these in your web browser:');
log(`  ${C.bold}http://localhost:3000${C.reset}  ${C.dim}the public store / marketing site${C.reset}`);
log(`  ${C.bold}http://localhost:3001${C.reset}  ${C.dim}the staff dashboard${C.reset}`);
log(`  ${C.bold}http://localhost:3002${C.reset}  ${C.dim}the admin / content editor (Payload CMS)${C.reset}`);
log(`\n${C.dim}To stop everything later: press Ctrl+C in this window, then run  docker compose down${C.reset}\n`);
