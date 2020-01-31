import React, { useContext, memo } from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { StockInfo } from '../StockInfo';
import Address from './Address';
import StoreHoursToday from './StoreHoursToday';
import PhoneNumber from './PhoneNumber';
import OpeningHours from './OpeningHours';
import FulfillmentContext from '../context';
import {
  store as storeStyles, storeMain, storeImage, storeName, storeInfo,
} from './style';

/**
 * Renders the store's addresses as pickup locations.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Store({ store }) {
  const { selectLocation } = useContext(FulfillmentContext);

  if (!store || !store.addresses || store.addresses.length === 0) {
    return null;
  }

  return store.addresses.map((address) => {
    /**
     * Handles the click action.
     */
    function handleClick() {
      selectLocation({
        code: store.code,
        name: store.name,
        addressCode: address.code,
        visibleInventory: store.productInventory.visible,
      });
    }

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
            <StoreHoursToday hours={store.operationHours} />
            <Address address={address} />
            <StockInfo
              location={{
                storeName: store.name,
                visibleInventory: store.productInventory.visible,
              }}
              showStoreName={false}
            />
          </div>
        </div>
        <Accordion renderLabel={() => i18n.text('product.location.details')}>
          <OpeningHours hours={store.operationHours} />
          <PhoneNumber phone={address.phoneNumber} />
        </Accordion>
      </div>
    );
  });
}

Store.propTypes = {
  store: PropTypes.shape(),
};

Store.defaultProps = {
  store: null,
};

export default memo(Store);
