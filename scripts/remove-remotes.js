const util = require('util');
const exec = util.promisify(require('child_process').exec);
const repos = require('../repos.json');
const logger = require('./logger');

const { themes, extensions } = repos;

/**
 * Adds a new remote to a predefined package.
 * @param {string} name The remote name.
 */
async function removeRemote(name) {
  try {
    await exec(`git remote remove ${name}`);
    logger.log(`Removed remote ${name}`);
  } catch (error) {
    throw error;
  }
}

// Remove the theme remotes.
Object.keys(themes).forEach(async (name) => {
  await removeRemote(name);
});

// Remove the extensions remotes.
Object.keys(extensions).forEach(async (extension) => {
  const name = extension.replace('@shopgate-', 'ext-');
  await removeRemote(name);
});
