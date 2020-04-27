import { connect } from 'react-redux';
import fetchCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { getCategory } from '@shopgate/pwa-common-commerce/category/selectors';
import { makeGetSubcategoriesByCategoryId } from './selectors';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getSubcategoriesByCategoryId = makeGetSubcategoriesByCategoryId();

  return (state, { categoryId }) => ({
    category: getCategory(state, { categoryId }),
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
