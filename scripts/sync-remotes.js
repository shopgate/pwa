const util = require('util');
const exec = util.promisify(require('child_process').exec);
const repos = require('../repos.json');
const logger = require('./logger');

const { themes, extensions } = repos;

/**
 * Synch the current master with the remote
 * @param {string} remote The remote name.
 * @param {string} pathname The local pathname.
 */
async function synchRepo(remote, pathname) {
  const cmd = `git subtree push --prefix=${pathname} ${remote} master`;

  try {
    await exec(cmd);
    logger.log(`Synched master of ${pathname}`);
  } catch (error) {
    throw error;
  }
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
