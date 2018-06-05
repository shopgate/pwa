import { connect } from 'react-redux';
import { getProductName } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  name: getProductName(state),
});

/**
 * Check to see if the product name arrived.
 * @param {Object} next The next props.
 * @param {Object} prev The previous props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.name && next.name) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
