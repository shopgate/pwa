#!/usr/bin/env node
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { argv } = require('yargs');
const fs = require('fs');
const compareVersions = require('compare-versions');
const { Changelog: LernaChangelog } = require('lerna-changelog');
const lernaConfiguration = require('lerna-changelog/lib/configuration');
const logger = require('./logger');

/**
 * Parses a version into its components without prerelease information.
 * @param {string} v The version to be parsed
 * @return {{sub: number, major: number, minor: number}}
 */
function parseVersion(v) {
  const [
    , // Full match of no interest.
    major = null,
    sub = null,
    minor = null,
  ] = /^v?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-.*)?$/.exec(v);
  if (major === null || sub === null || minor === null) {
    const err = new Error(`Invalid version string (${v})!`);
    logger.error(err);
    throw err;
  }

  return {
    major,
    sub,
    minor,
  };
}

if (!argv.next || argv.next.length === 0) {
  const err = new Error('Required param "next" for next version was not specified!');
  logger.error(err);
  throw err;
}

/**
 * Extends lerna-changelog's "Changelog" class to customize its behavior.
 */
class Changelog extends LernaChangelog {
  /* eslint-disable class-methods-use-this */
  /**
   * Overrides original method to avoid printing a list of committers at the end of each release
   * @override
   * @return {Promise<null>}
   */
  async getCommitters() {
    return null;
  }
  /* eslint-enable class-methods-use-this */

  /**
   * @override
   * @param {Object[]} commits The commits to process.
   * @return {Object[]}
   */
  toCommitInfos(commits) {
    // Filter ot prerelease tags from commits
    const ci = LernaChangelog.prototype.toCommitInfos.call(this, commits);
    return ci.map(commit => ({
      ...commit,
      tags: commit.tags ? commit.tags.filter(tag => !tag.includes('-')) : undefined,
    }));
  }

  /**
   * Filters out all releases that appear below the "from" release.
   * @param {string} from Minimum version tag
   * @param {string} to Maximum version tag
   * @return {Promise<Object[]>}
   */
  async listReleases(from, to) {
    const min = parseVersion(from);
    const releases = await LernaChangelog.prototype.listReleases.call(this, from, to);
    return releases.filter((release) => {
      // Always treat unreleased as "higher"
      if (release.name === '___unreleased___') {
        return true;
      }

      // Keep higher and equal versions
      const cur = parseVersion(release.name);
      return compareVersions(
        `${cur.major}.${cur.sub}.${cur.minor}`,
        `${min.major}.${min.sub}.${min.minor}`
      ) >= 0;
    });
  }
}

/**
 * Main async method
 */
async function run() {
  try {
    // Find last release: Get tags, filter out wrong tags and pre-releases, then take last one.
    const { stdout } = await exec("git tag | grep 'v' | grep -Ev '-' | tail -1");
    const prevVersion = stdout.trim();
    const nextVersion = parseVersion(argv.next);
    const nextVersionString = `v${nextVersion.major}.${nextVersion.sub}.${nextVersion.minor}`;

    // Read previous changelog to extend it (remove ending line feeds -> added back in later)
    const changelogContent = fs.readFileSync('CHANGELOG.md', { encoding: 'utf8' }).trimRight();

    const config = lernaConfiguration.load();

    // This causes the "Unreleased" title to be replaced by a version that links to a github diff.
    config.nextVersion = `[${
      nextVersionString
    }](https://github.com/shopgate/theme-gmd/compare/${prevVersion}...${nextVersionString})`;

    // Skip creating if the "nextVersion" is already filled out.
    if (changelogContent.includes(config.nextVersion)) {
      // Output the already existing data when already is there already.
      logger.log(changelogContent);
      return;
    }

    const changelog = new Changelog(config);

    const latestChanges = await changelog.createMarkdown({
      tagFrom: prevVersion,
      tagTo: nextVersionString,
    });

    // Add changes to the top of the main changelog
    const newChangelog = changelogContent.replace(
      '# Changelog\n',
      `# Changelog\n\n${latestChanges.trim()}\n\n`
    );

    // Print the output for the bash/makefile to read
    logger.log(newChangelog);
  } catch (error) {
    throw error;
  }
}

run();
