import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../types';

/**
 * Selects a value from the redux state, typed with the state of the app.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
