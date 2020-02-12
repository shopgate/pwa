import { combineReducers } from 'redux';
import locationsById from './locationsById';
import locationsByProductId from './locationsByProductId';
import userLocation from './userLocation';
import userFormInput from './userFormInput';

export default combineReducers({
  locationsById,
  locationsByProductId,
  userLocation,
  userFormInput,
});
