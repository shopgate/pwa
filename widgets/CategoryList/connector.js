import { connect } from 'react-redux';
import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { getCurrentCategories } from '@shopgate/pwa-common-commerce/category/selectors';

/**
 * Connects the dispatch function to a calleble function in the props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getCategory(categoryId) {
    dispatch(getCategory(categoryId));
  },
});

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  items: getCurrentCategories(state, props),
});

export default connect(mapStateToProps, mapDispatchToProps);
