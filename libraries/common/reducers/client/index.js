import { combineReducers } from 'redux';
import info from './info';
import connectivity from './connectivity';

export default combineReducers({
  info,
  connectivity,
});
