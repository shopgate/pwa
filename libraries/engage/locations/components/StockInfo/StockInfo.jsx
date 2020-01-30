import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import defaultsDeep from 'lodash/defaultsDeep';
import { getThemeSettings } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import { PRODUCT_LOCATION_STOCK_INFO } from '../../constants';
import defaultSettings from './defaultSettings';
import getAvailabilitySettings from './getAvailabilitySettings';
import Inventory from './Inventory';
import StoreName from './StoreName';

/**
 * Renders visible stock information based on the given location.
 * @param {Object} props The component props.
 * @return {JSX}
 */
function StockInfo({ location, className, showStoreName }) {
  const { locationStockInfo } = getThemeSettings('product');
  const settings = defaultsDeep(locationStockInfo, defaultSettings);

  const { availabilityText = '', availabilityTextColor = 'inherit' } =
    getAvailabilitySettings(settings, location.visibleInventory, location.inventoryBlind);

  const defaultClassName = css({
    color: availabilityTextColor,
    fontSize: '0.875rem',
    margin: 0,
  });

  return (
    <SurroundPortals
      portalName={PRODUCT_LOCATION_STOCK_INFO}
      portalProps={{
        location,
        className,
        visibleInventory: location.visibleInventory,
        inventoryBlind: location.inventoryBlind,
        availabilityText,
        availabilityTextColor,
      }}
    >
      {(location.visibleInventory !== null || location.name) && (
        <span className={classNames(`${defaultClassName}`, `${className}`)}>
          <Inventory
            availabilityText={availabilityText}
            location={location}
            maxNumberVisible={settings.maxNumberOfVisibleInventory}
            aboveMaxExtension={settings.aboveMaxExtension}
          />
          <StoreName
            name={showStoreName ? location.name : ''}
            displayCapitalized={location.visibleInventory === null || !availabilityText}
          />
        </span>
      )}
    </SurroundPortals>
  );
}

StockInfo.propTypes = {
  location: PropTypes.shape({
    name: PropTypes.string,
    productCode: PropTypes.string,
    visibleInventory: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    inventoryBlind: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }).isRequired,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  showStoreName: PropTypes.bool,
};

StockInfo.defaultProps = {
  className: '',
  showStoreName: true,
};

export default hot(StockInfo);
