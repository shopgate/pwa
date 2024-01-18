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
}) => {
  // Create memoized context value.
  const value = useMemo(() => ({
    subscriptions,
    addBackInStoreSubscription,
  }), [addBackInStoreSubscription, subscriptions]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

BackInStoreRemindersProvider.propTypes = {
  addBackInStoreSubscription: PropTypes.func.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  children: PropTypes.node,
};
BackInStoreRemindersProvider.defaultProps = {
  children: null,
};

export default connect(BackInStoreRemindersProvider);
