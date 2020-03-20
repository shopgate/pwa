// @flow
import { combineReducers } from 'redux';
import locationsById from './locationsById';
import locationsByProductId from './locationsByProductId';
import userLocation from './userLocation';
import userFormInput from './userFormInput';
import userSearch from './userSearch';
import { type LocationsState } from '../locations.types';

export default combineReducers<LocationsState>({
  locationsById,
  locationsByProductId,
  userLocation,
  userFormInput,
  userSearch,
});
