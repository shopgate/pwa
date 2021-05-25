// @flow
import React, { useContext, Fragment } from 'react';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { Accordion } from '../../../components';
import { StoreContext } from './Store.context';
import { StockInfo } from '../StockInfo';
import { StoreOpeningHours } from './StoreOpeningHours';
import { StoreAddress } from './StoreAddress';
import { StorePhoneNumber } from './StorePhoneNumber';
import { StoreAddressShort } from './StoreAddressShort';
import { storeDetailsBody, storeDetailsAccordion } from './Store.style';
import { FulfillmentContext } from '../../locations.context';

/**
 * Renders a single store details.
 * @returns {JSX}
 */
export function StoreDetails() {
  const store = useContext(StoreContext);
  const { product } = useContext(FulfillmentContext);

  if (!store) {
    return null;
  }

  return (
    <Accordion
      className={storeDetailsAccordion}
      renderLabel={() => (
        <Fragment>
          <StoreAddress address={store.address} />
          <ResponsiveContainer breakpoint="<sm" appAlways>
            <StockInfo location={store} product={product} showStoreName={false} />
          </ResponsiveContainer>
        </Fragment>
      )}
      contentClassName={storeDetailsBody}
    >
      <StoreOpeningHours hours={store.operationHours} />
      {store.address && <StorePhoneNumber phone={store.address.phoneNumber} />}
      <StoreAddressShort showFull address={store.address} />
    </Accordion>
  );
}
