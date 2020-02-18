import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import defaultsDeep from 'lodash/defaultsDeep';
import { getThemeSettings } from '../../../core';
import { SurroundPortals } from '../../../components';
import { PRODUCT_LOCATION_STOCK_INFO } from '../../constants';
import { getAvailabilitySettings } from '../../helpers';
import defaultSettings from './StockInfo.defaultSettings';
import Inventory from './StockInfoInventory';
import StoreName from './StockInfoStoreName';

/**
 * Renders visible stock information based on the given location.
 * @param {Object} props The component props.
 * @return {JSX}
 */
function StockInfo({ location, className, showStoreName }) {
  const { locationStockInfo } = getThemeSettings('product') || {};
  const settings = defaultsDeep(locationStockInfo, defaultSettings);

  const { availabilityText = '', availabilityTextColor = 'inherit' } =
    getAvailabilitySettings(settings, location);

  const defaultClassName = css({
    color: availabilityTextColor,
    fontSize: '0.875rem',
    margin: 0,
  });

  let displayCapitalized = location.productInventory && location.productInventory.visible === null;
  displayCapitalized = displayCapitalized || !availabilityText;

  return (
    <SurroundPortals
      portalName={PRODUCT_LOCATION_STOCK_INFO}
      portalProps={{
        location,
        className,
        availabilityText,
        availabilityTextColor,
      }}
    >
      <span className={classNames(`${defaultClassName}`, `${className}`)}>
        <Inventory
          availabilityText={availabilityText}
          location={location}
          maxNumberVisible={settings.maxNumberOfVisibleInventory}
          aboveMaxExtension={settings.aboveMaxExtension}
        />
        <StoreName
          name={showStoreName ? location.name : ''}
          displayCapitalized={displayCapitalized}
        />
      </span>
    </SurroundPortals>
  );
}

StockInfo.propTypes = {
  location: PropTypes.shape({
    name: PropTypes.string,
    productInventory: PropTypes.shape({
      visible: PropTypes.number,
    }),
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

export default StockInfo;
