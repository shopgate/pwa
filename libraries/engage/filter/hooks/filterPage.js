import { useContext } from 'react';
import FilterPageProvider from '../providers/FilterPageProvider.context';

// Adding a return type would break type inference
// eslint-disable-next-line valid-jsdoc
/**
 * Returns the value of the filter page provider state.
 */
export const useFilterPage = () => useContext(FilterPageProvider);
