const { spawn } = require('child_process');

const child = spawn(process.execPath, process.argv.slice(2), {
  stdio: ['ignore', 'inherit', 'inherit'],
  detached: true,
});

/**
 * Stops the compiler together with every process it started, then exits.
 */
function stop() {
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch (error) {
    child.kill();
  }

  process.exit();
}

process.stdin.on('end', stop);
process.stdin.on('error', stop);
process.stdin.resume();
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code);
});
