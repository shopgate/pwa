import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from './BackInStockSubscriptionsProvider.context';
import connect from './BackInStockSubscriptionsProvider.connector';

/**
 * Back in Stock Provider
 * @returns {JSX}
 */
const BackInStoreSubscriptionsProvider = ({
  subscriptions,
  children,
  addBackInStoreSubscription,
  isFetching,
  removeBackInStoreSubscription,
}) => {
  // Create memoized context value.
  const value = useMemo(() => ({
    subscriptions,
    addBackInStoreSubscription,
    removeBackInStoreSubscription,
    isFetching,

  }), [addBackInStoreSubscription, isFetching, removeBackInStoreSubscription, subscriptions]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

BackInStoreSubscriptionsProvider.propTypes = {
  addBackInStoreSubscription: PropTypes.func.isRequired,
  removeBackInStoreSubscription: PropTypes.func.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  children: PropTypes.node,
  isFetching: PropTypes.bool,
};
BackInStoreSubscriptionsProvider.defaultProps = {
  children: null,
  isFetching: false,
};

export default connect(BackInStoreSubscriptionsProvider);
