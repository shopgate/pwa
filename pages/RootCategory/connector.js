import { connect } from 'react-redux';
import { getRootCategories } from '@shopgate/pwa-common-commerce/category/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  categories: getRootCategories(state),
});

/**
 * @param {Object} next The next state.
 * @param {Object} prev the previous state.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (next.categories !== null && prev.categories === null) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
