// @flow
import React from 'react';
import { i18n } from '../../../core';
import { Accordion } from '../../../components';
import StoreAddressMailingAddress from './StoreAddressMailingAddress';
import StoreAddressOpeningHours from './StoreAddressOpeningHours';
import StoreAddressPhoneNumber from './StoreAddressPhoneNumber';

import { storeDetails, storeDetailsOperationHours } from './style';

type Props = {
  store: Object;
  address: Object;
}

/**
 * Renders a single store address heading.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const StoreAddressStoreDetails = ({ store, address }: Props) => {
  let hasOperationHours = false;

  if (store.operationHours) {
    hasOperationHours = Object.values(store.operationHours).filter(Boolean).length > 0;
  }

  return (
    <Accordion renderLabel={() => i18n.text('locations.details')}>
      <div className={storeDetails}>
        {hasOperationHours && (
          <div className={storeDetailsOperationHours}>
            <StoreAddressOpeningHours hours={store.operationHours} />
          </div>
        )}
        <div>
          <StoreAddressMailingAddress address={address} />
          <StoreAddressPhoneNumber phone={address.phoneNumber} />
        </div>
      </div>
    </Accordion>
  );
};

export default StoreAddressStoreDetails;
