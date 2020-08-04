import { combineReducers } from 'redux';
import products from './products';
import lists from './lists';

export default combineReducers({
  products,
  lists,
});
