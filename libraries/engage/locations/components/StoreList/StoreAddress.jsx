import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import FulfillmentContext from '../context';
import { StockInfo } from '../StockInfo';
import StoreContext from './Store.context';
import StoreAddressHeading from './StoreAddressHeading';
import StoreAddressHoursToday from './StoreAddressHoursToday';
import StoreAddressStoreDetails from './StoreAddressStoreDetails';

import {
  store as storeStyles, storeMain, storeInfo,
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
        <div
          className={storeInfo}
          onClick={handleClick}
          onKeyDown={handleClick}
          role="button"
          tabIndex={0}
        >
          <StoreAddressHeading store={store} />
          <StoreAddressHoursToday hours={store.operationHours} />
          <StockInfo
            location={store}
            showStoreName={false}
          />
        </div>
      </div>
      <StoreAddressStoreDetails store={store} address={address} />
    </div>
  );
}

StoreAddress.propTypes = {
  address: PropTypes.shape().isRequired,
};

export default StoreAddress;
