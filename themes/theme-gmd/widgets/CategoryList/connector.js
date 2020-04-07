import { connect } from 'react-redux';
import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { getCategoriesById } from '../selectors';

/**
 * Connects the dispatch function to a callable function in the props.
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
  items: getCategoriesById(state, { categoryId: props.settings.categoryNumber }),
});

/**
 * Check to see if the categories have arrived.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.items && next.items) return false;
  if ((prev.items && next.items) && (prev.items.length !== next.items.length)) return false;
  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
