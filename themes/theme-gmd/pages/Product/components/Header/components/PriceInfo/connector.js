import { connect } from 'react-redux';
import { getProduct } from '@shopgate/pwa-common-commerce/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  product: getProduct(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The current component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.product && next.product) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
