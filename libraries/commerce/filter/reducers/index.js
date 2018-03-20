import { combineReducers } from 'redux';
import activeFilters from './activeFilters';
import activeHash from './activeHash';
import availableFilters from './availableFilters';
import temporaryFilters from './temporaryFilters';

export default combineReducers({
  activeFilters,
  availableFilters,
  activeHash,
  temporaryFilters,
});
