const util = require('util');
const exec = util.promisify(require('child_process').exec);
const repos = require('../repos.json');
const logger = require('./logger');

const { themes } = repos;

/**
 * Adds a new remote to a predefined package.
 * @param {string} name The remote name.
 * @param {string} url The repository URL.
 */
async function addRemote(name, url) {
  // eslint-disable-next-line no-useless-catch
  try {
    await exec(`git remote add ${name} ${url}`);
    logger.log(`Added remote to ${name}`);
  } catch (error) {
    throw error;
  }
}

// Add the theme remotes.
Object.keys(themes).forEach(async (name) => {
  await addRemote(name, themes[name]);
});

exec('git fetch --all')
  .catch((error) => {
    throw error;
  });
