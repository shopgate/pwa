import { combineReducers } from 'redux';
import config from '../../core/config/config.reducers';
import shopSettings from './shopSettings';
import merchantSettings from './merchantSettings';
import appSettings from './appSettings';

export const settings = combineReducers({
  config,
  shopSettings,
  merchantSettings,
  appSettings,
});
