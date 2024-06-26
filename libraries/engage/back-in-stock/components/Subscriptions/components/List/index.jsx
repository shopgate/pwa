import React, { useCallback } from 'react';
import { css } from 'glamor';
import { LoadingIndicator, Accordion, Card } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { useBackInStockSubscriptions } from '@shopgate/engage/back-in-stock/hooks';
import Subscription from '../Subscription';

const styles = {
  root: css({
    margin: '8px 8px 10px',
  }).toString(),
  divider: css({
    height: 1,
    width: 'calc(100% + 32px)',
    backgroundColor: 'rgb(234, 234, 234)',
    marginLeft: -16,
    marginRight: -16,
    marginBottom: 16,
  }).toString(),
  emptyText: css({
    marginBottom: 16,
  }).toString(),
};

/**
 * The Back In Stock Subscriptions List.
 * @returns {JSX}
 */
const List = () => {
  const {
    isInitial,
    groupedSubscriptions,
  } = useBackInStockSubscriptions();

  const renderLabel = useCallback(groupKey =>
    <div>
      {i18n.text(`back_in_stock.list_states.${groupKey}`)}
    </div>, []);

  return (
    <div>
      {Object.entries(groupedSubscriptions).map(([groupKey, filteredSubscriptions]) => (
        <Card className={styles.root} key={groupKey}>
          <Accordion
            className=""
            openWithChevron
            renderLabel={() => renderLabel(groupKey)}
            chevronPosition="left"
            startOpened
          >
            <div className={styles.divider} />
            {isInitial ? <LoadingIndicator /> : null}
            {!isInitial && filteredSubscriptions.length === 0 ? (
              <div className={styles.emptyText}>{i18n.text('back_in_stock.empty_list_reminder')}</div>
            ) : null}

            {!isInitial && filteredSubscriptions.map((subscription, index) => (
              <div key={subscription.subscriptionCode}>
                <Subscription
                  subscription={subscription}
                  productId={subscription.productCode}
                  key={subscription.subscriptionCode}
                  group={groupKey}
                />
                {(index === filteredSubscriptions.length - 1) ?
                  null :
                  <div className={styles.divider} />}
              </div>
            ))}
          </Accordion>
        </Card>
      ))}

    </div>
  );
};

export default List;
