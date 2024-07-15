import { connect } from 'react-redux';
import { fetchCategoryOrRootCategories } from '@shopgate/engage/category';
import {
  makeGetAreRootCategoriesFetching,
  makeGetSubcategoriesByCategoryId,
} from './selectors';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getAreRootCategoriesFetching = makeGetAreRootCategoriesFetching();
  const getSubcategoriesByCategoryId = makeGetSubcategoriesByCategoryId();

  return (state, { categoryId }) => ({
    rootCategoriesFetching: getAreRootCategoriesFetching(state),
    subcategories: getSubcategoriesByCategoryId(state, { categoryId }),
  });
};

/**
 * Maps the contents of the state to the component props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchCategory: id => dispatch(fetchCategoryOrRootCategories(id)),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
