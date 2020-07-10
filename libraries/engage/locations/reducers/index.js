// @flow
import { combineReducers } from 'redux';
import userFormInput from './userFormInput';
import userSearch from './userSearch';
import storage from './storage';
import { type LocationsState } from '../locations.types';

export default combineReducers<LocationsState>({
  userFormInput,
  userSearch,
  storage,
});
