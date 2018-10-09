const { argv } = require('yargs');
const util = require('util');
const repos = require('../repos.json');
const exec = util.promisify(require('child_process').exec);
const logger = require('./logger');

const { branch = 'master' } = argv;
const { themes, extensions } = repos;

/**
 * Sync the current master with the remote
 * @param {string} remote The remote name.
 * @param {string} pathname The local pathname.
 * @param {string} remoteBranchName The name of the remote branch to synchronize to.
 */
async function synchRepo(remote, pathname, remoteBranchName) {
  const cmd = `git subtree push --prefix=${pathname} ${remote} ${remoteBranchName}`;
console.log(cmd);
  try {
    #await exec(cmd);
    logger.log(`Synchronized '${remoteBranchName}' in ${pathname}`);
  } catch (error) {
    throw error;
  }
}

// Sync the themes master.
Object.keys(themes).forEach(async (name) => {
  const pathname = `themes/${name}`;
  await synchRepo(name, pathname, branch);
});

// Sync the extensions master.
Object.keys(extensions).forEach(async (extension) => {
  const name = extension.replace('@shopgate-', 'ext-');
  const pathname = `extensions/${extension}`;
  await synchRepo(name, pathname, branch);
});
