export const PRE_RELEASE_TYPES = ['alpha', 'beta', 'rc'] as const;

/**
 * Pre-release identifier of a release version.
 */
export type PreReleaseType = typeof PRE_RELEASE_TYPES[number];

/**
 * Parsed release version with the values derived from it.
 */
export interface ReleaseVersion {
  /**
   * Version without "v" prefix, e.g. "7.33.0-beta.1". Used for npm and package.json files.
   */
  version: string;
  /**
   * Version with "v" prefix, e.g. "v7.33.0-beta.1". Used for git branches, tags and GitHub releases.
   */
  name: string;
  /**
   * Name without pre-release part, e.g. "v7.33.0". Used for the changelog heading.
   */
  baseName: string;
  /**
   * Major version number.
   */
  major: number;
  /**
   * Minor version number.
   */
  minor: number;
  /**
   * Patch version number.
   */
  patch: number;
  /**
   * Pre-release type, null for stable versions.
   */
  preRelease: PreReleaseType | null;
  /**
   * Pre-release counter, e.g. 1 for "-beta.1". null for stable versions.
   */
  preReleaseNumber: number | null;
  /**
   * Whether this is a stable version without pre-release part.
   */
  stable: boolean;
  /**
   * npm dist-tag: "latest" for stable versions, "beta" for all pre-releases (like the legacy release).
   */
  distTag: 'latest' | 'beta';
}

const VERSION_PATTERN = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(alpha|beta|rc)\.([1-9]\d*))?$/;

/**
 * Parses a release version and derives the npm dist-tag.
 * @param input "X.Y.Z" or "X.Y.Z-(alpha|beta|rc).N", optionally with "v" prefix.
 * @returns The parsed version.
 */
export const parseVersion = (input: string): ReleaseVersion => {
  const match = VERSION_PATTERN.exec(input.trim());

  if (!match) {
    throw new Error(`Invalid version "${input}". Expected X.Y.Z or X.Y.Z-(alpha|beta|rc).N`);
  }

  const [, major, minor, patch, preRelease, preReleaseNumber] = match;
  const base = `${major}.${minor}.${patch}`;
  const version = preRelease ? `${base}-${preRelease}.${preReleaseNumber}` : base;

  return {
    version,
    name: `v${version}`,
    baseName: `v${base}`,
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    preRelease: (preRelease as PreReleaseType | undefined) ?? null,
    preReleaseNumber: preReleaseNumber ? Number(preReleaseNumber) : null,
    stable: !preRelease,
    distTag: preRelease ? 'beta' : 'latest',
  };
};

/**
 * Checks whether a string is a supported release version.
 * @param input The version string.
 * @returns Whether it can be parsed.
 */
export const isValidVersion = (input: string) => VERSION_PATTERN.test(input.trim());

/**
 * Compares two versions semver-like (alpha < beta < rc < stable).
 * @param a The first version.
 * @param b The second version.
 * @returns -1, 0 or 1.
 */
export const compareVersions = (a: ReleaseVersion, b: ReleaseVersion): number => {
  const parts: Array<'major' | 'minor' | 'patch'> = ['major', 'minor', 'patch'];

  for (const part of parts) {
    const diff = a[part] - b[part];
    if (diff !== 0) {
      return Math.sign(diff);
    }
  }

  if (a.stable || b.stable) {
    return Number(a.stable) - Number(b.stable);
  }

  const typeDiff = PRE_RELEASE_TYPES.indexOf(a.preRelease as PreReleaseType)
    - PRE_RELEASE_TYPES.indexOf(b.preRelease as PreReleaseType);

  if (typeDiff !== 0) {
    return Math.sign(typeDiff);
  }

  return Math.sign((a.preReleaseNumber ?? 0) - (b.preReleaseNumber ?? 0));
};
