import { useContext } from 'react';
import AppContext from '../contexts/AppContext';

/**
 * Provides the properties of the app context.
 * @returns {Object}
 */
export function useApp() {
  const appContext = useContext(AppContext);
  return appContext;
}
