// @flow
import * as React from 'react';
import { css } from 'glamor';
import classNames from 'classnames';
import defaultsDeep from 'lodash/defaultsDeep';
import { getThemeSettings } from '../../../core';
import { SurroundPortals } from '../../../components';
import { PRODUCT_LOCATION_STOCK_INFO } from '../../constants';
import { getAvailabilitySettings } from '../../helpers';
import defaultSettings from './StockInfo.defaultSettings';
import { StockInfoInventory } from './StockInfoInventory';
import StoreName from './StockInfoStoreName';
import { type Location } from '../../locations.types';

type Props = {
  location: Location,
  className?: string | {} | null,
  showStoreName?: boolean,
}

/**
 * Renders visible stock information based on the given location.
 * @param {Object} props The component props.
 * @return {JSX}
 */
export function StockInfo({ location, className, showStoreName }: Props) {
  const { locationStockInfo } = getThemeSettings('product') || {};
  const settings = defaultsDeep(locationStockInfo, defaultSettings);

  const { availabilityText = '', availabilityTextColor = 'inherit' } =
    getAvailabilitySettings(settings, location);

  const defaultClassName = css({
    color: availabilityTextColor,
    fontSize: '0.875rem',
    margin: 0,
  }).toString();

  const displayCapitalized = React.useMemo(() => (
    location.productInventory && location.productInventory.visible === null
  ) || !availabilityText, [availabilityText, location.productInventory]);

  const portalProps = React.useMemo(() => ({
    location,
    className,
    availabilityText,
    availabilityTextColor,
  }), [availabilityText, availabilityTextColor, className, location]);

  return (
    <SurroundPortals portalName={PRODUCT_LOCATION_STOCK_INFO} portalProps={portalProps}>
      <span className={classNames(defaultClassName, css(className).toString())}>
        <StockInfoInventory
          availabilityText={availabilityText}
          location={location}
          maxNumberVisible={settings.maxNumberOfVisibleInventory}
          aboveMaxExtension={settings.aboveMaxExtension}
        />
        <StoreName
          name={showStoreName ? location.name : null}
          displayCapitalized={displayCapitalized}
        />
      </span>
    </SurroundPortals>
  );
}

StockInfo.defaultProps = {
  className: null,
  showStoreName: true,
};
