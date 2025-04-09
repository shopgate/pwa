import { createContext } from 'react';

/**
 * @typedef {Object} ContextMenuContextType
 * @property {(event: React.MouseEvent<HTMLButtonElement>) => void} handleMenuToggle
 * Toggles visibility of the ContextMenu.
 */

/**
 * @type {ContextMenuContextType}
 */
const initialContext = {};

export default createContext(initialContext);
