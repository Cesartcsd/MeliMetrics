import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd, env, execPath, platform } from 'node:process';

const executable = execPath;
const cliPath = join(cwd(), 'node_modules', 'supabase', 'dist', 'supabase.js');
const dataDirectory = env.MELIMETRICS_LOCAL_DATA_DIR
  ?? (platform === 'win32' ? 'D:\\MeliMetrics\\supabase-data' : join('.local', 'supabase-data'));

function run(args, { quiet = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, [cliPath, ...args], {
      stdio: quiet ? ['ignore', 'ignore', 'pipe'] : 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Supabase CLI (${args.join(' ')}) terminou com código ${code ?? 'desconhecido'}.`));
      }
    });
  });
}

let started = false;
try {
  await run(['start', '--ignore-health-check'], { quiet: true });
  started = true;
  await run(['db', 'reset']);
  await mkdir(dataDirectory, { recursive: true });
  await run([
    'db',
    'dump',
    '--local',
    '--schema',
    'private',
    '--data-only',
    '--file',
    join(dataDirectory, 'foundation-data.sql'),
  ]);
} finally {
  if (started) {
    await run(['stop']);
  }
}
