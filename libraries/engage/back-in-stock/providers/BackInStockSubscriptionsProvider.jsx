import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from './BackInStockSubscriptionsProvider.context';
import connect from './BackInStockSubscriptionsProvider.connector';

/**
 * Back in Stock Provider
 * @returns {JSX}
 */
const BackInStockSubscriptionsProvider = ({
  subscriptions,
  children,
  addBackInStockSubscription,
  isFetching,
  isInitial,
  removeBackInStockSubscription,
}) => {
  const groupedSubscriptions = useMemo(() => subscriptions.reduce((acc, subscription) => {
    const { status } = subscription;
    const groupingStatus = (status === 'inactive' || status === 'triggered') ? 'past' : status;
    acc[groupingStatus].push(subscription);
    return acc;
  }, {
    active: [],
    past: [],
  }), [subscriptions]);

  // Create memoized context value.
  const value = useMemo(() => ({
    subscriptions,
    groupedSubscriptions,
    addBackInStockSubscription,
    removeBackInStockSubscription,
    isFetching,
    isInitial,
  }), [addBackInStockSubscription,
    groupedSubscriptions,
    isFetching,
    isInitial,
    removeBackInStockSubscription,
    subscriptions]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

BackInStockSubscriptionsProvider.propTypes = {
  addBackInStockSubscription: PropTypes.func.isRequired,
  removeBackInStockSubscription: PropTypes.func.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  children: PropTypes.node,
  isFetching: PropTypes.bool,
  isInitial: PropTypes.bool,
};
BackInStockSubscriptionsProvider.defaultProps = {
  children: null,
  isFetching: false,
  isInitial: true,
};

export default connect(BackInStockSubscriptionsProvider);
