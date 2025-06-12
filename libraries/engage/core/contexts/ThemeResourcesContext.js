import { createContext } from 'react';

/**
 * @typedef  {import('./ThemeResourcesContext').ThemeResourcesContextType ThemeResourcesContextType}
 */

/** @type {import('react').Context<ThemeResourcesContextType>} */
export default createContext({
  widgets: {
    v1: {},
    v2: {},
  },
  components: {},
});
