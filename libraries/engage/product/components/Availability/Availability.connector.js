import { connect } from 'react-redux';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { AVAILABILITY_STATE_OK } from '@shopgate/pwa-common-commerce/product/constants';
import { makeGetSupportsFulfillmentSelectors } from '@shopgate/engage/core/config';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getSupportsFulfillmentSelectors = makeGetSupportsFulfillmentSelectors();

  return (state, props) => {
    const product = getProduct(state, props);

    if (!product) {
      return {
        availability: null,
        fulfillmentMethods: null,
        supportsFulfillmentSelectors: getSupportsFulfillmentSelectors(state),
      };
    }

    return {
      // Show stock info always as availability on PDP
      availability: !product.stock ? null : {
        text: product.stock.info,
        state: AVAILABILITY_STATE_OK,
      },
      fulfillmentMethods: product.fulfillmentMethods || null,
      supportsFulfillmentSelectors: getSupportsFulfillmentSelectors(state),
    };
  };
};

export default connect(makeMapStateToProps);
