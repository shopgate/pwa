import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getProductPriceData, hasProductVariants } from '@shopgate/pwa-common-commerce/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  price: getProductPriceData(state, props),
  hasProductVariants: hasProductVariants(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.price && next.price) {
    return false;
  }

  if (!isEqual(prev.price, next.price)) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
