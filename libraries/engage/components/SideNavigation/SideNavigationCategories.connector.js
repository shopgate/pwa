import { connect } from 'react-redux';
import fetchCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
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
  fetchCategory: id => dispatch(fetchCategory(id)),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
