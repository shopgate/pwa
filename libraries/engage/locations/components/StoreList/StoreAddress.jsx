import * as React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { StoreContext } from './Store.context';
import { FulfillmentContext } from '../../locations.context';
import { StockInfo } from '../StockInfo';
import { LocationIcon } from '../../../components';
import { i18n } from '../../../core';
import { address as container, addressIcon, stockInfoContainer } from './Store.style';

/**
 * Renders the pickup location's address information.
 * @param {Object} props The component props.
 * @param {Object} props.address The address object.
 * @param {boolean} props.pure Whether to only render the address without any wrapper components.
 * @returns {JSX.Element}
 */
export function StoreAddress({ address, pure }) {
  const store = React.useContext(StoreContext);
  const { product } = React.useContext(FulfillmentContext);

  if (!address) {
    return null;
  }

  const addressContent = (
    <div>
      <div data-test-id="street">
        {address.street}
      </div>
      {(address.street2 && address.street2 !== '') && (
        <div data-test-id="street2">
          {address.street2}
        </div>
      )}
      {(address.street3 && address.street3 !== '') && (
        <div data-test-id="street3">
          {address.street3}
        </div>
      )}
      {(address.street4 && address.street4 !== '') && (
        <div data-test-id="street4">
          {address.street4}
        </div>
      )}
      {i18n.text('locations.address', address)}
    </div>
  );

  if (pure) {
    return addressContent;
  }

  return (
    <div className={container}>
      <div className={addressIcon} aria-hidden>
        <LocationIcon />
      </div>
      <div>
        {addressContent}
        <ResponsiveContainer breakpoint="<sm" appAlways>
          <div className={stockInfoContainer}>
            <StockInfo location={store} product={product} showStoreName={false} />
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

StoreAddress.propTypes = {
  address: PropTypes.shape(),
  pure: PropTypes.bool,
};

StoreAddress.defaultProps = {
  address: null,
  pure: false,
};
