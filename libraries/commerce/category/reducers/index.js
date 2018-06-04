import { combineReducers } from 'redux';
import rootCategories from './rootCategories';
import categoriesById from './categoriesById';
import childrenByCategoryId from './childrenByCategoryId';

/**
 * The category reducer.
 */
export default combineReducers({
  categoriesById,
  childrenByCategoryId,
  rootCategories,
});
