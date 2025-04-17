import { combineReducers } from 'redux';
import settings from './settings';
import storage from './storage';

export default combineReducers({
  settings,
  storage,
});

