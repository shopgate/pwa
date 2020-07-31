import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import InfiniteContainer from '@shopgate/pwa-common/components/InfiniteContainer';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import { ViewContext } from '@shopgate/engage/components/View';
import { useOrderHistory } from '../../hooks';

/**
 * The OrderDetails components
 * @returns {JSX}
 */
const OrderHistoryLoader = ({ wrapper, iterator }) => {
  const { orders, totalOrderCount, fetchOrderHistory } = useOrderHistory();
  return (
    <ViewContext.Consumer>
      {({ getContentRef }) => (
        <InfiniteContainer
          containerRef={getContentRef()}
          wrapper={wrapper}
          iterator={iterator}
          loader={offset => fetchOrderHistory({
            limit: ITEMS_PER_LOAD,
            offset,
          })}
          items={orders}
          loadingIndicator={<LoadingIndicator />}
          totalItems={totalOrderCount}
          initialLimit={ITEMS_PER_LOAD}
          limit={ITEMS_PER_LOAD}
        />
      )}
    </ViewContext.Consumer>
  );
};

OrderHistoryLoader.propTypes = {
  iterator: PropTypes.node.isRequired,
  wrapper: PropTypes.node.isRequired,
};

export default hot(OrderHistoryLoader);
