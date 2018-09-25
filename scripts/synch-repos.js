const util = require('util');
const repos = require('../repos.json');
const exec = util.promisify(require('child_process').exec);
const logger = require('./logger');

const { themes, extensions } = repos;

/**
 * Synch the current master with the remote
 * @param {string} remote The remote name.
 * @param {string} pathname The local pathname.
 */
async function synchRepo(remote, pathname) {
  const cmd = `git subtree push --prefix=${pathname} ${remote} master`;
  const { stderr } = await exec(cmd);

  if (stderr) {
    throw stderr;
  }

  logger.log(`Synched master of ${pathname}`);
}

// Synch the themes master.
Object.keys(themes).forEach(async (name) => {
  const pathname = `themes/${name}`;
  await synchRepo(name, pathname);
});

// Synch the extensions master.
Object.keys(extensions).forEach(async (extension) => {
  const name = extension.replace('@shopgate-', 'ext-');
  const pathname = `extensions/${extension}`;
  await synchRepo(name, pathname);
});
