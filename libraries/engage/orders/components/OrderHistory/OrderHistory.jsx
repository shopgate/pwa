import React from 'react';
import { hot } from 'react-hot-loader/root';
import I18n from '@shopgate/pwa-common/components/I18n';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import InfiniteContainer from '@shopgate/pwa-common/components/InfiniteContainer';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import { ViewContext } from '@shopgate/engage/components/View';
import { Table, TableRow } from './OrderHistoryTable';
import { useOrderHistory } from '../../hooks';
import {
  root, title,
} from './OrderHistory.style';

/**
 * The OrderDetails components
 * @returns {JSX}
 */
const OrderHistory = () => {
  const { orders, totalOrderCount, fetchOrderHistory } = useOrderHistory();
  return (
    <div className={root}>
      <div className={title}>
        <I18n.Text string="titles.order_history" />
      </div>
      <ViewContext.Consumer>
        {({ getContentRef }) => (
          <InfiniteContainer
            containerRef={getContentRef()}
            wrapper={Table}
            iterator={TableRow}
            loader={offset => fetchOrderHistory({ limit: ITEMS_PER_LOAD, offset })}
            items={orders}
            loadingIndicator={<LoadingIndicator />}
            totalItems={totalOrderCount}
            initialLimit={ITEMS_PER_LOAD}
            limit={ITEMS_PER_LOAD}
          />
        )}
      </ViewContext.Consumer>
    </div>
  );
};

export default hot(OrderHistory);
