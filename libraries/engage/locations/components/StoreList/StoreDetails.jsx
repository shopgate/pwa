import React, { useContext } from 'react';
import { Accordion } from '../../../components';
import { StoreContext } from './Store.context';
import { StoreOpeningHours } from './StoreOpeningHours';
import { StoreAddress } from './StoreAddress';
import { StorePhoneNumber } from './StorePhoneNumber';
import { StoreAddressShort } from './StoreAddressShort';
import { storeDetailsBody, storeDetailsAccordion } from './Store.style';

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
      className={storeDetailsAccordion}
      renderLabel={() => (
        <StoreAddress address={store.address} />
      )}
      contentClassName={storeDetailsBody}
    >
      <StoreOpeningHours hours={store.operationHours} />
      {store.address && <StorePhoneNumber phone={store.address.phoneNumber} />}
      <StoreAddressShort showFull address={store.address} />
    </Accordion>
  );
}
