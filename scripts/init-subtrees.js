const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const repos = require('../repos.json');
const logger = require('./logger');

const { themes, extensions } = repos;

/**
 * @param {string} group The subtree group.
 * @param {string} name The subtree name.
 * @param {string} url The repository URL.
 */
async function initSubtree(group, name, url) {
  const prefix = `${group}/${name}`;

  if (fs.existsSync(`./${prefix}`)) {
    return;
  }

  try {
    await exec(`git subtree add --prefix ${prefix} ${url} develop --squash`);
    logger.log(`Added new subtree ${prefix}`);
  } catch (error) {
    throw error;
  }
}

// Add the theme subtrees.
Object.keys(themes).forEach(async (name) => {
  await initSubtree('themes', name, themes[name]);
});

// Add the extensions subtrees.
Object.keys(extensions).forEach(async (extension) => {
  await initSubtree('extensions', extension, extensions[extension]);
});
