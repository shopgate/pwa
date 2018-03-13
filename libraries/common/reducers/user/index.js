import { combineReducers } from 'redux';
import login from './login';
import data from './data';
import { persist } from '../../store/persistent';

/**
 * The current version of the state created by this reducer.
 * @type {string}
 */
const STATE_VERSION = 'v1';

export default persist(
  'user',
  combineReducers({
    login,
    data,
  }),
  STATE_VERSION
);
