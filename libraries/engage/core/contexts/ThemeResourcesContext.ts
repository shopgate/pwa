import { createContext } from 'react';
import type {
  ComponentType, Context, CSSProperties, ReactNode,
} from 'react';

/**
 * The props an extension can pass to the app bar of the theme.
 */
export interface ThemeAppBarProps {
  /**
   * The title of the page, a translation key or a text.
   */
  title?: string | null;
  /**
   * Elements for the left side. They replace the back button.
   */
  left?: ReactNode;
  /**
   * An element for the center, shown instead of the title.
   */
  center?: ReactNode;
  /**
   * Elements for the right side.
   */
  right?: ReactNode;
  /**
   * Elements below the bar.
   */
  below?: ReactNode;
  /**
   * Whether the bar shows the logo.
   */
  logo?: boolean;
  /**
   * Whether the bar shows the header buttons the merchant configured. Defaults to true.
   */
  actionButtons?: boolean;
  /**
   * The background color of the bar.
   */
  backgroundColor?: string;
  /**
   * The text color of the bar.
   */
  textColor?: string;
  /**
   * Class names for the bar.
   */
  classes?: {
    /**
     * Class name of the inner container.
     */
    inner?: string;
    /**
     * Class name of the outer container.
     */
    outer?: string;
  };
}

/**
 * What the render function of the theme's product card is called with.
 */
export interface ThemeProductCardRenderProps {
  /**
   * The product the card shows.
   */
  product: unknown;
  /**
   * The URL of the product page.
   */
  url: string;
  /**
   * Further props of the card.
   */
  [key: string]: unknown;
}

/**
 * The props of the theme's product card.
 */
export interface ThemeProductCardProps {
  /**
   * The id of the product the card shows.
   */
  productId: string;
  /**
   * Renders the content of the card, by default the product card of engage.
   */
  render?: (props: ThemeProductCardRenderProps) => ReactNode;
  /**
   * Class name of the card.
   */
  className?: string | null;
  /**
   * Whether the card has a shadow. Defaults to true.
   */
  shadow?: boolean;
  /**
   * Inline styles of the card.
   */
  style?: CSSProperties;
  /**
   * Further props, passed on to the render function.
   */
  [key: string]: unknown;
}

/**
 * The props of the theme's product grid, which renders the product grid of engage.
 */
export interface ThemeProductGridProps {
  /**
   * The products to show.
   */
  products?: unknown[] | null;
  /**
   * Which parts of the product tiles are shown.
   */
  flags?: {
    /**
     * Whether the tiles show the product name.
     */
    name?: boolean;
    /**
     * Whether the tiles show the price.
     */
    price?: boolean;
    /**
     * Whether the tiles show the rating.
     */
    reviews?: boolean;
  } | null;
  /**
   * Whether the grid loads more products while scrolling. Defaults to true.
   */
  infiniteLoad?: boolean;
  /**
   * Loads more products when infinite loading is enabled.
   */
  handleGetProducts?: (...args: unknown[]) => unknown;
  /**
   * The total number of products, needed for infinite loading.
   */
  totalProductCount?: number | null;
  /**
   * The hash of the current request, needed for infinite loading.
   */
  requestHash?: string | null;
  /**
   * Describes in which context the grid is used, e.g. for tracking.
   */
  scope?: string | null;
  /**
   * Metadata for the product list type context.
   */
  meta?: Record<string, unknown> | null;
  /**
   * Class name of the grid container.
   */
  className?: string | null;
}

/**
 * The tab bar of the theme, with its static helpers.
 */
export type ThemeTabBar = ComponentType & {
  /**
   * Shows the tab bar. With force it's also shown when it isn't enabled.
   */
  show: (force?: boolean) => void;
  /**
   * Hides the tab bar.
   */
  hide: () => void;
};

/**
 * A mapping object that contains multiple components provided by the theme.
 * Key is the component name, value is the component.
 */
export interface ThemeComponentMap {
  /**
   * Used to display the app bar at the top of the screen.
   */
  AppBar: ComponentType<ThemeAppBarProps>;
  /**
   * Acts as a wrapper around displayed products and is usually used in components like product
   * sliders.
   */
  ProductCard: ComponentType<ThemeProductCardProps>;
  /**
   * Used to display products in a grid layout.
   */
  ProductGrid: ComponentType<ThemeProductGridProps>;
  /**
   * Used to display the header section of a product page. Contains rating, name, and product
   * information. Depending on the theme it may also include CTA buttons.
   */
  ProductHeader: ComponentType;
  /**
   * Tab bar component provided by the theme. Only available inside the ios11 theme.
   */
  TabBar?: ThemeTabBar;
}

/**
 * A mapping of widget code to widget React components.
 */
export interface ThemeWidgetMap {
  /**
   * The widget component of a widget code.
   */
  [key: string]: ComponentType;
}

/**
 * Context type for theme resources.
 */
export interface ThemeResourcesContextType {
  /**
   * Mapping object that contains all available widgets.
   * Key is the widget code, value is the widget component.
   */
  widgets: {
    /**
     * All available widgets for Widget API v1
     */
    v1: ThemeWidgetMap;
    /**
     * All available widgets for Widget API v2
     */
    v2: ThemeWidgetMap;
  };

  /**
   * Mapping object that contains multiple components provided by the theme.
   * Key is the component name, value is the component.
   */
  components: ThemeComponentMap;
}

const ThemeResourcesContext: Context<ThemeResourcesContextType> = createContext({
  widgets: {
    v1: {},
    v2: {},
  },
  components: {} as ThemeComponentMap,
});

export default ThemeResourcesContext;
