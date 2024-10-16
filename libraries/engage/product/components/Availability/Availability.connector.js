import { connect } from 'react-redux';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { AVAILABILITY_STATE_OK } from '@shopgate/pwa-common-commerce/product/constants';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => (state, props) => {
  const product = getProduct(state, props);

  if (!product) {
    return {
      availability: null,
      fulfillmentMethods: null,
    };
  }

  return {
    // Show stock info always as availability on PDP
    availability: !product.stock ? null : {
      text: product.stock.info,
      state: AVAILABILITY_STATE_OK,
    },
    fulfillmentMethods: product.fulfillmentMethods || null,
  };
};

export default connect(makeMapStateToProps);
