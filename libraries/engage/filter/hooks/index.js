import { useContext } from 'react';
import SortProvider from '../providers/SortProvider.context';

/**
 * Returns the value of the sort provider state.
 * @returns {Object}
 */
export const useSort = () => useContext(SortProvider);

export * from './filterPage';
