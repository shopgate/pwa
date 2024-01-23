import { connect } from 'react-redux';
import { addBackInStoreSubscription } from '@shopgate/engage/back-in-stock/actions';
import { makeGetIsProductOnBackInStockList } from '@shopgate/engage/back-in-stock/selectors/backInStock';

/**
 * @param {Object} _ The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = (_, props) => {
  const getIsOnBackInStockList =
    makeGetIsProductOnBackInStockList({ productCode: props.productId });

  return state => ({
    isOnBackInStockList: getIsOnBackInStockList(state),
  });
};

const mapDispatchToProps = {
  addBackInStoreSubscription,
};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
);
