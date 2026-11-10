import { connect } from 'react-redux';
import {
  getProductId,
  getProductShipping,
  getProductShippingState,
} from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
  const entry = getProductShippingState(state)[getProductId(state, props)];

  return {
    shipping: getProductShipping(state, props),
    isLoading: !entry || !!entry.isFetching,
  };
};

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.shipping && next.shipping) {
    return false;
  }

  if (prev.isLoading !== next.isLoading) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
