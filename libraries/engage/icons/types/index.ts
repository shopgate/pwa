import type { coreIcons } from '../defaults/coreIcons';

/**
 * The names of the icons the app ships with.
 */
export type CoreIconName = keyof typeof coreIcons;

/**
 * The name of an icon: a core icon or one an extension registered. Core names stay suggested.
 */
export type IconName = CoreIconName | (string & Record<never, never>);

/**
 * An icon as SVG markup. The markup is a complete svg element, or for icons from the theme
 * extension config only its content.
 */
export interface IconDefinition {
  /**
   * The markup of the icon.
   */
  svg: string;
  /**
   * Whether the icon keeps its own colors instead of following the text color.
   */
  keepColors?: boolean;
  /**
   * Size of the drawing relative to the icon box, e.g. 0.9 for 90%. Defaults to 1.
   */
  scale?: number;
  /**
   * Line width on the 24 unit grid for icons drawn with lines. Wins over the global line width.
   */
  strokeWidth?: number;
}

/**
 * An icon a merchant configured to replace one of the app.
 */
export type IconOverride = IconDefinition;

/**
 * Icon overrides by icon name.
 */
export type IconOverrides = Record<string, IconOverride>;

/**
 * Where a resolved icon comes from: the app settings, the theme extension config or the registry.
 */
export type IconSource = 'override' | 'legacy' | 'default';

/**
 * An icon resolved by its name.
 */
export interface ResolvedIcon extends IconDefinition {
  /**
   * Where the icon comes from.
   */
  source: IconSource;
  /**
   * Whether the markup still has to be normalized. The core defaults are stored normalized.
   */
  normalize: boolean;
}

/**
 * Options for parsing icon markup.
 */
export interface ParseIconOptions {
  /**
   * Keeps the colors of the markup instead of replacing them with the text color.
   */
  keepColors?: boolean;
  /**
   * Whether to normalize colors, ids and stroke widths. When false, the markup is only sanitized.
   */
  normalize?: boolean;
}

/**
 * Icon markup after sanitizing and normalizing, ready to be rendered.
 */
export interface ParsedIcon {
  /**
   * The viewBox of the markup's own svg element, if it has one.
   */
  viewBox?: string;
  /**
   * The presentation attributes of the markup's own svg element.
   */
  attributes: Record<string, string>;
  /**
   * The sanitized content of the svg element.
   */
  content: string;
  /**
   * The stroke width the icon was designed with, in the units of its viewBox.
   */
  strokeWidth?: number;
}

/**
 * An entry of the icon catalog the admin preview requests.
 */
export interface IconCatalogEntry {
  /**
   * The name of the icon.
   */
  name: string;
  /**
   * `core` for icons of the app, otherwise the scope of the extension that registered the icon.
   */
  source: string;
  /**
   * The default markup of the icon as a complete svg element.
   */
  default: string;
  /**
   * An icon the merchant customized in the theme extension config.
   */
  legacyOverride?: string;
}

/**
 * The icon catalog the admin preview requests.
 */
export interface IconCatalog {
  /**
   * The version of the catalog format.
   */
  version: 1;
  /**
   * The icons that can be replaced.
   */
  icons: IconCatalogEntry[];
}
