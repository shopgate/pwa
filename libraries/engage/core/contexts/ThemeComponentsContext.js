import { createContext } from 'react';

/**
 * @typedef {Object} ThemeComponentsContext
 * @property {Object<string, React.ComponentType<any>>} widgets Mapping object that contains all
 * available widgets. Key is the widget code, value is the widget component.
 * @property {Object<string, React.ComponentType<any>>} components Mapping object that contains
 * multiple components provided by the theme. Key is the component name, value is the component
 */

/** @type {import('react').Context<ThemeComponentsContext>} */
export default createContext({
  widgets: {},
  components: {},
});
