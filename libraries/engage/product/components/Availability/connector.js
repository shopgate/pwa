import { connect } from 'react-redux';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { AVAILABILITY_STATE_OK } from '@shopgate/pwa-common-commerce/product/constants';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
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

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => (prev.availability || !next.availability);

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
