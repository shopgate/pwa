import { combineReducers } from 'redux';
import locationsById from './locationsById';
import locationsByProductId from './locationsByProductId';

export default combineReducers({
  locationsById,
  locationsByProductId,
});
