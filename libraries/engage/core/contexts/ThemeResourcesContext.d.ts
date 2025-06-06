import { ComponentType, Context } from 'react';

/**
 * A mapping object that contains multiple components provided by the theme.
 * Key is the component name, value is the component.
 */
export interface ThemeComponentMap {
  /**
   * Used to display the app bar at the top of the screen.
   */
  AppBar: ComponentType;
  /**
   * Acts as a wrapper around displayed products and is usually used in components like product sliders.
   */
  ProductCard: ComponentType;
  /**
   * Used to display products in a grid layout.
   */
  ProductGrid: ComponentType;
  /**
   * Used to display the header section of a product page. Contains rating, name, and product information.
   * Depending on the theme it may also include CTA buttons.
   */
  ProductHeader: ComponentType;
  /**
   * Tab bar component provided by the theme. Only available inside the ios11 theme.
   */
  TabBar?: ComponentType;
}

/**
 * A mapping of widget code to widget React components.
 */
export interface ThemeWidgetMap {
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
  widgets: ThemeWidgetMap;

  /**
   * Mapping object that contains multiple components provided by the theme.
   * Key is the component name, value is the component.
   */
  components: ThemeComponentMap;
}

/**
 * React context for theme resources.
 */
declare const ThemeResourcesContext: Context<ThemeResourcesContextType>;

export default ThemeResourcesContext;
