import { combineReducers } from 'redux';
import userFormInput from './userFormInput';
import userSearch from './userSearch';
import storeFinderSearch from './storeFinderSearch';
import storage from './storage';
import user from './user';

/**
 * @typedef {import('../locations.types').LocationsState} LocationsState
 */

export default combineReducers(/** @type {LocationsState} */({
  userFormInput,
  userSearch,
  user,
  storeFinderSearch,
  storage,
}));
