import { useContext } from 'react';
import SideNavigationContext from './SideNavigationProvider.context';

/**
 * Returns the value of the side navigation provider state.
 * @returns {Object}
 */
export const useSideNavigation = () => useContext(SideNavigationContext);
