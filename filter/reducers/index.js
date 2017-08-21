import { combineReducers } from 'redux';
import availableFilters from './availableFilters';
import activeFilters from './activeFilters';
import temporaryFilters from './temporaryFilters';

export default combineReducers({
  availableFilters,
  activeFilters,
  temporaryFilters,
});
