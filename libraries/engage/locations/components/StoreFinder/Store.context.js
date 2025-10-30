import { createContext } from 'react';

/**
 * @typedef {import('../../locations.types').Location} Location
 */

export const StoreContext = createContext(/** @type {Location} */ ({}));
