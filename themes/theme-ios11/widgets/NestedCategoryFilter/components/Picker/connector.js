import { connect } from 'react-redux';
import { fetchCategoryOrRootCategories } from '@shopgate/engage/category';
import { getCategoriesById } from '../../../selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, { categoryId }) => ({
  subcategories: getCategoriesById(state, { categoryId }),
});

/**
 * Maps the contents of the state to the component props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchCategory: id => dispatch(fetchCategoryOrRootCategories(id)),
});

export default connect(mapStateToProps, mapDispatchToProps);
