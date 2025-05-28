import { createContext } from 'react';

/**
 * @typedef {Object} ThemeComponentMap
 * @property {React.ComponentType} AppBar Used to display the app bar at the top of the screen.
 * @property {React.ComponentType} ProductCard Acts as a wrapper around
 * displayed products and is usually used in components like product sliders.
 * @property {React.ComponentType} ProductGrid Used to display products in a grid layout.
 * @property {React.ComponentType} ProductHeader Used to display the header section of a product
 * page. Contains rating, name, and product information. Depending on the theme it may also include
 * CTA buttons.
 * @property {React.ComponentType} [TabBar] Tab bar component provided by the theme. Only available
 * inside the ios11 theme.
 */

/**
 * @typedef {Object.<string, React.ComponentType>} ThemeWidgetMap
 * A mapping of widget code to widget React components.
 */

/**
 * @typedef {Object} ThemeResourcesContext
 * @property {ThemeWidgetMap} widgets Mapping object that contains all available widgets.
 * Key is the widget code, value is the widget component.
 * @property {ThemeComponentMap} components Mapping object that contains multiple components
 * provided by the theme. Key is the component name, value is the component
 */

/** @type {import('react').Context<ThemeResourcesContext>} */
export default createContext({
  widgets: {},
  components: {},
});
