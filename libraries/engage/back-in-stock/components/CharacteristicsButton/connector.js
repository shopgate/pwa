import { connect } from 'react-redux';
import {
  getIsBackInStockEnabled,
  makeGetSubscriptionByCharacteristics,
} from '@shopgate/engage/back-in-stock';
import {
  makeGetProductByCharacteristics,
} from '@shopgate/engage/product';

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => {
  const getProductByCharacteristics = makeGetProductByCharacteristics();
  const getSubscriptionByCharacteristics = makeGetSubscriptionByCharacteristics();

  return (state, props) => {
    const variant = getProductByCharacteristics(state, props) || {};
    return ({
      variant,
      subscription: getSubscriptionByCharacteristics(state, props),
      isBackInStockEnabled: getIsBackInStockEnabled(state, props),
    });
  };
};

export default connect(makeMapStateToProps);
