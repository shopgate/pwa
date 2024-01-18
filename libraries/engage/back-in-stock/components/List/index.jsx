import React from 'react';
import { useBackInStockReminderContext } from '../../hooks';
import { Button } from '../../../components';

// const styles = {};

/**
 * The BackInStockReminders component.
 * @returns {JSX}
 */
const List = () => {
  const { subscriptions, addBackInStoreSubscription } = useBackInStockReminderContext();
  return (
    <div>
      <div>asdf</div>
      <div>asdf</div>
      <div>asdf</div>
      <div>asdf</div>
      <div>asdf</div>

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

      {subscriptions.map(({ productCode, status }) => (
        <div>
          <div>
Product:
            {productCode}
          </div>
          <div>
Status:
            {status}
          </div>
        </div>))}
    </div>
  );
};

export default List;
