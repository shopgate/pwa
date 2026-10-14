import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../types';

/**
 * Provides the dispatch function of the store, typed so that a dispatched thunk returns what
 * the thunk returns.
 * @returns The dispatch function.
 */
export const useAppDispatch = (): AppDispatch => useDispatch() as unknown as AppDispatch;
