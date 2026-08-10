/**
 * Replacement for asset imports (images, fonts, media) which are irrelevant for unit tests.
 *
 * Written in CommonJS on purpose, so that the mapping also works for consumers which replaced the
 * transformIgnorePatterns of this package with ones that don't transform @shopgate packages.
 */
module.exports = '';
