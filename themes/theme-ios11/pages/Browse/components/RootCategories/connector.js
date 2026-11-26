import { connect } from 'react-redux';
import {
  getRootCategories,
  getRootCategoriesState,
} from '@shopgate/pwa-common-commerce/category/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  categories: getRootCategories(state),
  categoriesFetching: !!getRootCategoriesState(state).isFetching,
});

/**
 * @param {Object} next The next state.
 * @param {Object} prev the previous state.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.categories && next.categories) {
    return false;
  }

  return prev.categoriesFetching === next.categoriesFetching;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
