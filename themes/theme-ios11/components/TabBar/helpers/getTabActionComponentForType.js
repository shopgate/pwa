import { CORE_TAB_TYPES } from '../coreTabData';
import { createCoreTabAction } from '../components/CoreTabAction';

export const tabs = Object.fromEntries(
  CORE_TAB_TYPES.map(type => [type, createCoreTabAction(type)])
);

/**
 * Resolves the tab action component for a core tab type.
 * @param {string} type The type name of the tab.
 * @return {Object|undefined} The component, or undefined when the type is no core tab type.
 */
const getTabActionComponentForType = type => tabs[type];

export default getTabActionComponentForType;
