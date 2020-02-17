import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core';
import { Accordion } from '../../../components';
import FulfillmentContext from '../context';
import { StockInfo } from '../StockInfo';
import StoreContext from './Store.context';
import StoreAddressHoursToday from './StoreAddressHoursToday';
import StoreAddressMailingAddress from './StoreAddressMailingAddress';
import StoreAddressOpeningHours from './StoreAddressOpeningHours';
import StoreAddressPhoneNumber from './StoreAddressPhoneNumber';
import {
  store as storeStyles, storeMain, storeImage, storeName, storeInfo,
} from './style';

/**
 * Renders a single store address.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function StoreAddress({ address }) {
  const store = useContext(StoreContext);
  const { selectLocation } = useContext(FulfillmentContext);

  const handleClick = useCallback(() => {
    selectLocation(store);
  }, [selectLocation, store]);

  return (
    <div className={storeStyles} key={address.code}>
      <div className={storeMain}>
        <div className={storeImage} />
        <div
          className={storeInfo}
          onClick={handleClick}
          onKeyDown={handleClick}
          role="button"
          tabIndex={0}
        >
          <div className={storeName} data-test-id="store-name">{store.name}</div>
          <StoreAddressHoursToday hours={store.operationHours} />
          <StoreAddressMailingAddress address={address} />
          <StockInfo
            location={store}
            showStoreName={false}
          />
        </div>
      </div>
      <Accordion renderLabel={() => i18n.text('locations.details')}>
        <StoreAddressOpeningHours hours={store.operationHours} />
        <StoreAddressPhoneNumber phone={address.phoneNumber} />
      </Accordion>
    </div>
  );
}

StoreAddress.propTypes = {
  address: PropTypes.shape().isRequired,
};

export default StoreAddress;
