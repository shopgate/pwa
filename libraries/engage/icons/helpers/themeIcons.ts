/**
 * Resolves the markup of a theme icon by its name, or returns null when it has no such icon.
 */
export type ThemeIconResolver = (name: string) => string | null;

/**
 * The icons of the theme extension config, keyed by icon name.
 */
export type ThemeIcons = Record<string, string | null>;

let resolver: ThemeIconResolver | null = null;

let legacyIcons: ThemeIcons = {};

/**
 * Sets the function that resolves the icons of `themeConfig.icons`.
 * @param nextResolver The resolver.
 */
export const setThemeIconResolver = (nextResolver: ThemeIconResolver | null) => {
  resolver = nextResolver;
};

/**
 * Returns the icons of the theme extension config as they were delivered.
 * @returns The icons.
 */
export const getLegacyThemeIcons = () => legacyIcons;

/**
 * Reads an icon through the resolver, with the delivered icon as fallback.
 * @param name The name of the icon.
 * @returns The markup of the icon.
 */
const readIcon = (name: string) => (resolver && resolver(name)) || legacyIcons[name];

/**
 * Creates the `icons` object of the theme config. It keeps the keys of the theme extension
 * config, but reads each icon through the resolver once one is set. Writes of a changed value
 * replace the delivered icon, writes of the value just read (e.g. by `writeToConfig`) are ignored.
 * The icons are plain markup: `keepColors`, `scale` and `strokeWidth` of a merchant override don't
 * reach code that renders them from here. Render icons with `ThemeIcon` to get those.
 * @param icons The icons of the theme extension config.
 * @returns The icons object.
 */
export const createThemeIcons = (icons: ThemeIcons = {}): ThemeIcons => {
  legacyIcons = { ...icons };

  return Object.keys(legacyIcons).reduce<ThemeIcons>(
    (result, name) => Object.defineProperty(result, name, {
      enumerable: true,
      get: () => readIcon(name),
      set: (value: string | null) => {
        if (value !== readIcon(name)) {
          legacyIcons[name] = value;
        }
      },
    }),
    {}
  );
};
