import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';
import { StoreContext } from './Store.context';
import { FulfillmentContext } from '../../locations.context';
import { StockInfo } from '../StockInfo';
import { LocationIcon } from '../../../components';
import { i18n } from '../../../core';

const { gap } = themeVariables;

const useStyles = makeStyles()({
  container: {
    display: 'flex',
    flexFlow: 'row nowrap',
    color: 'var(--color-text-medium-emphasis)',
    marginBottom: 4,
  },
  addressIcon: {
    color: 'var(--color-text-medium-emphasis)',
    fontSize: '1.4rem',
    padding: `${gap.xsmall}px ${gap.big}px 0 0`,
  },
  stockInfoContainer: {
    marginTop: 8,
    ':empty': {
      display: 'none',
    },
  },
});

/**
 * Renders the pickup location's address information.
 * @param {Object} props The component props.
 * @param {Object} props.address The address object.
 * @param {boolean} props.pure Whether to only render the address without any wrapper components.
 * @returns {JSX.Element}
 */
export function StoreAddress({ address, pure }) {
  const { classes } = useStyles();
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
    <div className={classes.container}>
      <div className={classes.addressIcon} aria-hidden>
        <LocationIcon />
      </div>
      <div>
        {addressContent}
        {product && (
          <div className={classes.stockInfoContainer}>
            <StockInfo location={store} product={product} showStoreName={false} />
          </div>
        )}
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
