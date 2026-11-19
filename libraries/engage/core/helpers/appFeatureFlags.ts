/**
 * The feature flags the native app reports, grouped by category and version.
 */
type AppFeatureFlags = Record<string, Record<string, { flags?: unknown } | undefined> | undefined>;

/**
 * The app info the native app injects into the window, including its feature flags.
 */
type AppInfo = NonNullable<Window['SGAppInfo']> & {
  /**
   * Missing in apps that don't report feature flags.
   */
  featureFlags?: AppFeatureFlags;
};

/**
 * Checks whether the native app reports a feature flag. Outside of the app, and with apps that
 * don't report the flag, it returns false; a fallback for development is up to the caller.
 * @param category The category of the feature flags, e.g. `Push` or `Keychain`.
 * @param flag The feature flag to look for.
 * @param version The version key within the category.
 * @returns Whether the app reports the flag.
 */
export const isAppFeatureFlagEnabled = (
  category: string,
  flag: string,
  version = '1'
): boolean => {
  const appInfo = window.SGAppInfo as AppInfo | undefined;
  const flags = appInfo?.featureFlags?.[category]?.[version]?.flags;

  return Array.isArray(flags) && flags.includes(flag);
};
