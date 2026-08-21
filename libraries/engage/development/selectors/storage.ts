import { createSelector } from 'reselect';
import { DEFAULT_DEVELOPMENT_STORAGE } from '../reducers/storage';
import type { DevelopmentState, DevelopmentStorageState } from '../types';

/**
 * Retrieves the development storage state from the store. Falls back to the defaults when the
 * slice is not present, for the same reason the settings selectors do.
 * @param state The current application state.
 * @returns The development storage state.
 */
const getState = (state: DevelopmentState): DevelopmentStorageState =>
  state?.development?.storage ?? DEFAULT_DEVELOPMENT_STORAGE;

/**
 * Creates a selector that returns the current status bar style object from the storage.
 */
export const getStatusBarStyleStorage = createSelector(
  getState,
  state => state.statusBarStyle
);
