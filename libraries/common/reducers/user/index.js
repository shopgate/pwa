import { combineReducers } from 'redux';
import login from './login';
import data from './data';
import location from './location';

export default combineReducers({
  login,
  data,
  location,
});
