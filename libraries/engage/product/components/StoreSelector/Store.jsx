import React, { memo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@shopgate/pwa-ui-material';
import I18n from '@shopgate/pwa-common/components/I18n';
import Address from './Address';
import StoreHoursToday from './StoreHoursToday';
import PhoneNumber from './PhoneNumber';
import OpeningHours from './OpeningHours';
import { store as storeStyles, storeMain, storeImage, storeName, storeInfo } from './style';
import StoreSelectorContext from './context';

/**
 * Renders the store's addresses as pickup locations.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Store = ({ store }) => {
  const { selectLocation, close } = useContext(StoreSelectorContext);

  if (!store || !store.addresses || store.addresses.length === 0) {
    return null;
  }

  return store.addresses.map((address) => {
    const handleClick = useCallback((event) => {
      event.preventDefault();
      selectLocation({
        locationCode: store.code,
        addressCode: address.code,
        visibleStock: store.inventory.visible,
      });
      close();
    }, [address, store]);

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
            <div className={storeName}>{store.name}</div>
            <StoreHoursToday hours={store.operationHours} />
            <Address address={address} />
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
