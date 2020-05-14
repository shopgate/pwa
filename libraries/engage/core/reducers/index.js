import { combineReducers } from 'redux';
import config from '../config/config.reducers';
import shopSettings from './shopSettings';

export const settings = combineReducers({
  config,
  shopSettings,
});

