// @flow
import { createContext } from 'react';
import { type Location } from '../../locations.types';

export const StoreContext = createContext<Location>({});
