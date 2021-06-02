import { connect } from 'react-redux';
import { hasCategoryChildren, hasCategoryProducts } from '@shopgate/pwa-common-commerce/category/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  hasProducts: hasCategoryProducts(state, props),
  hasChildren: hasCategoryChildren(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.hasProducts !== next.hasProducts) {
    return false;
  }

  if (prev.hasChildren !== next.hasChildren) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
