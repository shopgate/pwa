// @flow
import { combineReducers } from 'redux';
import ordersById from './ordersById';
import ordersByNumber from './ordersByNumber';
import orders from './orders';

export default combineReducers({
  ordersById,
  ordersByNumber,
  orders,
});
