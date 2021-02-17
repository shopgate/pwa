import { connect } from 'react-redux';
import {
  getProduct,
  getProductStock,
  makeIsProductActive,
  makeIsBaseProductActive,
} from '@shopgate/engage/product';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const isProductActive = makeIsProductActive();
  const isBaseProductActive = makeIsBaseProductActive();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    product: getProduct(state, props),
    disabled: !isProductActive(state, props) || !isBaseProductActive(state, props),
    stockInfo: getProductStock(state, props),
  });
}

export default connect(
  makeMapStateToProps
);
