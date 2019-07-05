#!/usr/bin/env node

/* *************************************************************************************************
 * GENERAL INFORMATION:
 *
 * This script takes the last "stable" tag and creates a changelog from pull requests that were
 * done since the said tag up to the current HEAD. The param "release-name" is only used to create
 * a title for the latest entries.
 *
 * It uses the already existing "CHANGELOG.md" file and only extends it by adding the latest
 * entry on top. To properly work, the CHANGELOG.md file needs to at least contain the string
 * "# Changelog" ending with a line feed or otherwise it won't know where to add the new entry.
 * The original "CHANGELOG.md" file must be placed in the monorepo root directory.
 *
 * -------------------------------------------------------------------------------------------------
 * USAGE:
 *
 * This script is supposed to be called within the 'Makefile'.
 *
 * To use this script you need to provide a github api token via env variable "GITHUB_AUTH".
 * An optional "tagFrom" option can be set to release minor and patch versions for
 * previous major versions.
 * An optional "tagTo" option can be set to filter results up to the given tag name,
 * which must exist!
 * The optional appendPreviousChangelog=true (or false) defines if a full changelog is generated
 * or not.
 *
 * It can also be called like this (from monorepo root directory):
 * $     GITHUB_AUTH=123abc ./scripts/build-changelog.js --release-name=vX.Y.Z \
 * $         [--tagFrom=vX] [--tagTo=vX.Y.Z] --appendPreviousChangelog=true > CHANGELOG.md.tmp
 * $     && mv CHANGELOG.md.tmp CHANGELOG.md;
 *
 * -------------------------------------------------------------------------------------------------
 * GOTCHAS:
 *
 * Make sure not to route the stdout output of the script directly to "CHANGELOG.md" because it
 * would clear the file first and then there is nothing that can be done (resulting in a blank
 * "CHANGELOG.md" file).
 * Instead: Route the output to a temporary file and then overwrite the original later.
 *
 * -------------------------------------------------------------------------------------------------
 * SKIPPING TAGS:
 *
 * It is not a good idea to skip releases, or otherwise entries will be assigned to wrong tags.
 * If a tag is skipped then all the pull requests which are supposed to be part of the skipped
 * changelog entry, will be instead put into the next (latest) entry. That also means the release
 * order does matter! Changing the order of releases will cause duplicate change entries and also
 * a wrong order of the release version entries.
 * Latest releases (by date, not version) are always on top.
 *
 * Skipped tag example:
 * - Given that the feature branches "v6.4.0" and "v6.5.0" exist
 * - PR1 and PR2 => v6.4.0
 * - PR3 => v6.5.0
 * - v6.4.0 and v6.5.0 tags don't exist, yet
 * - Build the changelog (with release-name v6.5.0)
 *
 * Resulting output (not literally):
 *   v6.5.0: PR1, PR2 and PR3
 *
 * Why this output?
 * - The tag v6.4.0 was never released, so everything will be directly put under
 *   the v6.5.0 entry instead.
 * - This is keeps changelog generation simple and saves resources, because it can do most of
 *   its work locally.
 ************************************************************************************************ */

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { argv } = require('yargs');
const fs = require('fs');
const compareVersions = require('compare-versions');
const { Changelog: LernaChangelog } = require('lerna-changelog');
const lernaConfiguration = require('lerna-changelog/lib/configuration');
const logger = require('./logger');

// argv param name that should show up as the changelog version title
const releaseNameParam = 'release-name';

// filter the "prev" version list by a given version number without 'v' (or part of it)
let tagFrom = 'v'; // this can be a fully fixed tag name like "v5.11.0"

// upper version boundary up to which the changelog should
let tagTo = 'HEAD'; // Defaults to the latest commit of the current branch (usually release branch).

// option to avoid appending of the previous log
let appendPreviousChangelog = true;

/**
 * Parses a version into its components without prerelease information.
 * @param {string} v The version to be parsed
 * @return {{major: number, minor: number, patch: number}}
 */
function parseVersion(v) {
  const [
    , // Full match of no interest.
    major = null,
    minor = null,
    patch = null,
  ] = /^v?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-.*)?$/.exec(v);
  if (major === null || minor === null || patch === null) {
    const err = new Error(`Invalid version string (${v})!`);
    logger.error(err);
    throw err;
  }

  return {
    major: major !== null ? parseInt(major) : null,
    minor: minor !== null ? parseInt(minor) : null,
    patch: patch !== null ? parseInt(patch) : null,
  };
}

if (!argv[releaseNameParam] || argv[releaseNameParam] === 0) {
  const err = new Error(`Required param "${releaseNameParam}" was not specified!`);
  logger.error(err);
  throw err;
}

const nextVersion = parseVersion(argv[releaseNameParam]);

if (argv.tagFrom && argv.tagFrom !== 0) {
  ({ tagFrom } = argv);
}

if (argv.tagTo && argv.tagTo !== 0) {
  ({ tagTo } = argv);
}

if ((!argv.tagFrom || argv.tagFrom === 0) && tagFrom === 'v') {
  // Try to detect previous tag: Cut off pre-release bits and split into version components
  // -> use "tagTo" param if it's set, take release version otherwise
  let { major, minor, patch } = tagTo.toLowerCase() === 'head' ? nextVersion : parseVersion(tagTo);

  // If there was no patch before then a previous minor must exist (except on major update)
  if (patch === 0) {
    minor--;
  }
  // On major version changes get the latest minor number of the previous major version
  if (minor < 0) {
    minor = 0;
    major--;
    if (major < 0) {
      major = 0;
    }
    // limit search to latest previous major patch version
    tagFrom = `v${major}.`;
  } else {
    // limit search to latest previous minor patch version
    tagFrom = `v${major}.${minor}.`;
  }
}

if (argv.appendPreviousChangelog === 'false') {
  appendPreviousChangelog = false;
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
    const ci = super.toCommitInfos(commits);
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
    const releases = await super.listReleases(from, to);
    const min = parseVersion(from);
    return releases.filter((release) => {
      // Always treat unreleased as "higher"
      if (release.name === '___unreleased___') {
        return true;
      }

      // Keep higher and equal versions
      const cur = parseVersion(release.name);
      return compareVersions(
        `${cur.major}.${cur.minor}.${cur.patch}`,
        `${min.major}.${min.minor}.${min.patch}`
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
    const { stdout } = // get last filtered tag, sorted by version numbers in ascending order
      await exec(`git tag | grep '${tagFrom}' | grep -Ev '-' | sort -bt. -k1,1 -k2,2n -k3,3n -k4,4n -k5,5n | tail -1`);
    const prevTag = stdout.trim();

    // Normalize the given "release-name" for the tile (strip out pre-release information).
    const nextVersionString = `v${nextVersion.major}.${nextVersion.minor}.${nextVersion.patch}`;

    // Read previous changelog to extend it (remove ending line feeds -> added back in later)
    const changelogContent = fs.readFileSync('CHANGELOG.md', { encoding: 'utf8' }).trimRight();

    const config = lernaConfiguration.load();

    // This causes the "Unreleased" title to be replaced by a version that links to a github diff.
    config.nextVersion = `[${
      nextVersionString
      }](https://github.com/shopgate/pwa/compare/${prevTag}...${nextVersionString})`;

    // Skip creation if the "nextVersion" title is already present.
    if (changelogContent.includes(config.nextVersion)) {
      // Output the already existing data when already is there already.
      logger.log(changelogContent);
      return;
    }

    const changelog = new Changelog(config);

    // The "release-name" param is not supposed to be used here. Instead use "HEAD".
    const latestChanges = await changelog.createMarkdown({
      tagFrom: prevTag,
      tagTo,
    });

    // Add changes to the top of the main changelog
    let newChangelog = '# Changelog\n';
    if (appendPreviousChangelog) {
      newChangelog = changelogContent;
    }
    if (latestChanges.trim().length > 0) {
      newChangelog = newChangelog.replace(
        '# Changelog\n',
        `# Changelog\n\n${latestChanges.trim()}\n\n`
      );
      if (tagTo !== 'HEAD') {
        newChangelog = newChangelog.replace(
          `## ${tagTo} `,
          `## ${config.nextVersion} `
        );
      }
    }

    // Print the output for the bash/makefile to read
    logger.log(newChangelog);
  } catch (error) {
    throw error;
  }
}

run();
