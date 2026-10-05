const { spawn, spawnSync } = require('child_process');

const isWindows = process.platform === 'win32';
const STOP_SIGNALS = ['SIGINT', 'SIGTERM', 'SIGHUP'];

const child = spawn(process.execPath, process.argv.slice(2), {
  stdio: ['ignore', 'inherit', 'inherit'],
  detached: !isWindows,
  windowsHide: true,
});

/**
 * Stops the compiler together with every process it started, then exits without an error.
 */
function stop() {
  try {
    if (isWindows) {
      const { error, status } = spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
        windowsHide: true,
      });

      if (error || status !== 0) {
        child.kill();
      }
    } else {
      process.kill(-child.pid, 'SIGTERM');
    }
  } catch (error) {
    child.kill();
  }

  process.exit(0);
}

process.stdin.on('end', stop);
process.stdin.on('error', stop);
process.stdin.resume();
STOP_SIGNALS.forEach(signal => process.on(signal, stop));

child.on('exit', (code, signal) => {
  if (signal) {
    process.removeAllListeners(signal);
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code || 1);
});
