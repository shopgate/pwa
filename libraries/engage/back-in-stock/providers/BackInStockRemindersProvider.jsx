import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from './BackInStockRemindersProvider.context';
import connect from './BackInStockRemindersProvider.connector';

/**
 * Checkout Provider
 * @returns {JSX}
 */
const BackInStoreRemindersProvider = ({
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

BackInStoreRemindersProvider.propTypes = {
  addBackInStoreSubscription: PropTypes.func.isRequired,
  removeBackInStoreSubscription: PropTypes.func.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  children: PropTypes.node,
  isFetching: PropTypes.bool,
};
BackInStoreRemindersProvider.defaultProps = {
  children: null,
  isFetching: false,
};

export default connect(BackInStoreRemindersProvider);
