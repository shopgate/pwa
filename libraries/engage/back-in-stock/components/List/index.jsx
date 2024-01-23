import React from 'react';
import { css } from 'glamor';
import { LoadingIndicator } from '@shopgate/pwa-ui-shared';
import {
  Button, Accordion, Card,
} from '@shopgate/engage/components';
import { useBackInStockReminderContext } from '../../hooks';
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
  const {
    subscriptions,
    addBackInStoreSubscription,
    isFetching,
  } = useBackInStockReminderContext();

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
      {isFetching ? <LoadingIndicator /> : null}
      <div>degub spacing</div>
      <div>degub spacing</div>
      <div>degub spacing</div>
      <div>degub spacing</div>
      <Button onClick={() => {
        addBackInStoreSubscription({ productCode: '24-MB01' });
      }}
      >
        Add 24-MB01
      </Button>

      <Button onClick={() => {
        addBackInStoreSubscription({ productCode: '24-MG03' });
      }}
      >
        Add 24-MG03
      </Button>

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
            {filteredSubscriptions.length === 0 ? (
            // todo adjust translatiion
              <span>{i18n.text('favorites.empty')}</span>
            ) : null}

            {filteredSubscriptions.map((subscription, index) => (
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
