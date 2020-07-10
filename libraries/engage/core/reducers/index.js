import { combineReducers } from 'redux';
import config from '../config/config.reducers';
import shopSettings from './shopSettings';
import merchantSettings from './merchantSettings';

export const settings = combineReducers({
  config,
  shopSettings,
  merchantSettings,
});

