import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@shopgate/pwa-ui-material';
import I18n from '@shopgate/pwa-common/components/I18n';
import Address from './Address';
import StoreHoursToday from './StoreHoursToday';
import PhoneNumber from './PhoneNumber';
import OpeningHours from './OpeningHours';
import {
  store as storeStyles, storeMain, storeImage, storeName, storeInfo,
} from './style';
import StoreSelectorContext from './context';
import LocationStockInfo from '../LocationStockInfo';

/**
 * Renders the store's addresses as pickup locations.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Store = ({ store }) => {
  const { selectLocation } = useContext(StoreSelectorContext);

  if (!store || !store.addresses || store.addresses.length === 0) {
    return null;
  }

  return store.addresses.map((address) => {
    /**
     * Handles the click action.
     */
    const handleClick = () => {
      selectLocation({
        code: store.code,
        name: store.name,
        addressCode: address.code,
        visibleInventory: store.inventory.visible,
      });
    };

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
            <LocationStockInfo
              location={{
                storeName: store.name,
                visibleInventory: store.inventory.visible,
              }}
              showStoreName={false}
            />
          </div>
        </div>
        <Accordion renderLabel={() => <I18n.Text string="product.location.details" />}>
          <OpeningHours hours={store.operationHours} />
          <PhoneNumber phone={address.phoneNumber} />
        </Accordion>
      </div>
    );
  });
};

Store.propTypes = {
  store: PropTypes.shape(),
};

Store.defaultProps = {
  store: null,
};

export default memo(Store);
