const util = require('util');
const repos = require('../repos.json');
const exec = util.promisify(require('child_process').exec);
const logger = require('./logger');

const { themes, extensions } = repos;

/**
 * Adds a new remote to a predefined package.
 * @param {string} name The remote name.
 * @param {string} url The repository URL.
 */
async function addRemote(name, url) {
  const { stderr } = await exec(`git remote add ${name} ${url}`);

  if (stderr) {
    throw stderr;
  }

  logger.log(`Added remote to ${name}`);
}

// Add the theme remotes.
Object.keys(themes).forEach(async (name) => {
  await addRemote(name, themes[name]);
});

// Add the extensions remotes.
Object.keys(extensions).forEach(async (extension) => {
  const name = extension.replace('@shopgate-', 'ext-');
  await addRemote(name, extensions[extension]);
});

exec('git fetch --all')
  .catch(error => throw error);
