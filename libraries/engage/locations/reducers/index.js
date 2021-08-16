// @flow
import { combineReducers } from 'redux';
import userFormInput from './userFormInput';
import userSearch from './userSearch';
import storeFinderSearch from './storeFinderSearch';
import storage from './storage';
import user from './user';
import { type LocationsState } from '../locations.types';

export default combineReducers<LocationsState>({
  userFormInput,
  userSearch,
  user,
  storeFinderSearch,
  storage,
});
