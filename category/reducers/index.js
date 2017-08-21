import { combineReducers } from 'redux';
import rootCategories from './rootCategories';
import categoriesById from './categoriesById';
import childrenByCategoryId from './childrenByCategoryId';
import currentCategoryId from './currentCategoryId';

/**
 * The category reducer.
 */
export default combineReducers({
  rootCategories,
  categoriesById,
  childrenByCategoryId,
  currentCategoryId,
});
