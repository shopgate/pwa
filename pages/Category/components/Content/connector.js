import { connect } from 'react-redux';
import { getChildCategoriesById } from '@shopgate/pwa-common-commerce/category/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  categories: getChildCategoriesById(state, props),
});

/**
 * Check to see if the categories have arrived.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.categories && next.categories) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
