import { combineReducers } from 'redux';
import locationsByProductId from './locationsByProductId';
import userLocation from './userLocation';
import userFormInput from './userFormInput';

export default combineReducers({
  locationsByProductId,
  userLocation,
  userFormInput,
});
