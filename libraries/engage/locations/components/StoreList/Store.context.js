/**
 * @typedef {import('../../locations.types').Location} Location
 */

import { createContext } from 'react';

export const StoreContext = createContext(/** @type {Location} */ ({}));
