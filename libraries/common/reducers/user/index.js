import { combineReducers } from 'redux';
import login from './login';
import data from './data';

export default combineReducers({
  login,
  data,
});
