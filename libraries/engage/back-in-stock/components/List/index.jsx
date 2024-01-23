import React from 'react';
import { LoadingIndicator } from '@shopgate/pwa-ui-shared';
import { useBackInStockReminderContext } from '../../hooks';
import { Button } from '../../../components';

/**
 * The BackInStockReminders component.
 * @returns {JSX}
 */
const List = () => {
  const {
    subscriptions,
    addBackInStoreSubscription,
    removeBackInStoreSubscription,
    isFetching,
  } = useBackInStockReminderContext();
  return (
    <div>
      {isFetching ? <LoadingIndicator /> : null}
      <div>List</div>
      <div>List</div>
      <div>List</div>
      <div>List</div>
      <div>List</div>
      <div>List</div>
      <div>List</div>
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
      {subscriptions.map(({ productCode, status, subscriptionCode }) => (
        <div style={{
          padding: '8px',
          margin: '8px',
          border: 'solid',
        }}
        >
          <div>
Product:
            {productCode}
          </div>
          <div>
Status:
            {status}
          </div>
          <Button onClick={() => {
            removeBackInStoreSubscription({
              subscriptionCode,
            });
          }}
          >
            Remove
            {' '}
            {productCode}
          </Button>
        </div>))}
    </div>
  );
};

export default List;
