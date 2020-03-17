// @flow
import React, { useContext, Fragment } from 'react';
import { Accordion } from '../../../components';
import { StoreContext } from './Store.context';
import { StockInfo } from '../StockInfo';
import { StoreOpeningHours } from './StoreOpeningHours';
import { StoreAddress } from './StoreAddress';
import { StorePhoneNumber } from './StorePhoneNumber';
import { StoreAddressShort } from './StoreAddressShort';
import { storeDetailsBody } from './Store.style';

/**
 * Renders a single store details.
 * @returns {JSX}
 */
export function StoreDetails() {
  const store = useContext(StoreContext);
  if (!store) {
    return null;
  }

  return (
    <Accordion
      renderLabel={() => (
        <Fragment>
          <StoreAddress address={store.address} />
          <StockInfo location={store} showStoreName={false} />
        </Fragment>
      )}
      contentClassName={storeDetailsBody}
    >
      <StoreOpeningHours hours={store.operationHours} />
      {store.address && <StorePhoneNumber phone={store.address.phoneNumber} />}
      <StoreAddressShort address={store.address} />
    </Accordion>
  );
}
