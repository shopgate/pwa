import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import {
  getCategoryChildren,
  getCategoryChildCount,
  hasCategoryChildren,
} from '@shopgate/pwa-common-commerce/category/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  categories: getCategoryChildren(state, props),
  hasChildren: hasCategoryChildren(state, props),
  childrenCount: getCategoryChildCount(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.hasChildren !== next.hasChildren) {
    return false;
  }

  if (!isEqual(prev.categories, next.categories)) {
    return false;
  }

  if (prev.childrenCount !== next.childrenCount) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
