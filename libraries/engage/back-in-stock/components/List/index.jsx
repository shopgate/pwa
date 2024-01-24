import React, { useEffect, useState } from 'react';
import { css } from 'glamor';
import { LoadingIndicator } from '@shopgate/pwa-ui-shared';
import {
  Accordion, Card,
} from '@shopgate/engage/components';
import { useBackInStockSubscriptionsContext } from '../../hooks';
import Subscription from '../Subscription';
import { i18n } from '../../../core';

const styles = {
  divider: css({
    height: 1,
    width: 'calc(100% + 32px)',
    backgroundColor: 'rgb(234, 234, 234)',
    marginLeft: -16,
    marginRight: -16,
    marginBottom: 16,
  }).toString(),
};

/**
 * The BackInStockReminders component.
 * @returns {JSX}
 */
const List = () => {
  const [isInitial, setIsInitial] = useState(true);

  const {
    subscriptions,
    isFetching,
  } = useBackInStockSubscriptionsContext();

  useEffect(() => {
    if (!isFetching && isInitial) {
      setIsInitial(false);
    }
  }, [isFetching, isInitial]);

  const groupedSubscriptions = subscriptions.reduce((acc, subscription) => {
    const { status } = subscription;
    const groupingStatus = (status === 'inactive' || status === 'triggered') ? 'past' : status;
    acc[groupingStatus].push(subscription);
    return acc;
  }, {
    active: [],
    past: [],
  });

  return (
    <div>
      {Object.entries(groupedSubscriptions).map(([groupKey, filteredSubscriptions]) => (
        <Card className={styles.root} key={groupKey}>
          <Accordion
            className=""
            openWithChevron
            renderLabel={() => groupKey}
            chevronPosition="left"
            startOpened
          >
            <div className={styles.divider} />
            {isInitial ? <LoadingIndicator /> : null}
            {!isInitial && filteredSubscriptions.length === 0 ? (
              <span>{i18n.text('favorites.empty')}</span>
            ) : null}

            {!isInitial && filteredSubscriptions.map((subscription, index) => (
              <div>
                <Subscription subscription={subscription} key={subscription.subscriptionCode} />
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
