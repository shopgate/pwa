// @flow
import * as React from 'react';
import { css } from 'glamor';
import { connect } from 'react-redux';
import classNames from 'classnames';
import defaultsDeep from 'lodash/defaultsDeep';
import { makeGetLocationInventory } from '../../selectors';
import { getThemeSettings } from '../../../core';
import { SurroundPortals } from '../../../components';
import { PRODUCT_LOCATION_STOCK_INFO } from '../../constants';
import { getAvailabilitySettings } from '../../helpers';
import defaultSettings from './StockInfo.defaultSettings';
import { StockInfoInventory } from './StockInfoInventory';
import { type Location } from '../../locations.types';

type Props = {
  location: Location,
  inventory: any,
  className?: string | {} | null,
}

/**
 * Creates a mapper for redux.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getInventory = makeGetLocationInventory(
    (_, props) => props.location?.code,
    (_, props) => props.productId || props.product?.id
  );
  return (state, props) => ({
    inventory: getInventory(state, props),
  });
};

/**
 * Renders visible stock information based on the given location.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const StockInfoUnwrapped = ({ location, inventory, className }: Props) => {
  const { locationStockInfo } = getThemeSettings('product') || {};
  const settings = defaultsDeep(locationStockInfo, defaultSettings);

  const { availabilityText = '', availabilityTextColor = 'inherit', comingSoon = false } =
    getAvailabilitySettings(settings, location, inventory);

  const defaultClassName = css({
    color: availabilityTextColor,
    fontSize: '0.75rem',
    margin: 0,
    ':not(:empty) ~ *': {
      marginLeft: 14,
    },
  }).toString();

  const portalProps = React.useMemo(() => ({
    location,
    inventory,
    comingSoon,
    settings,
    className,
    availabilityText,
    availabilityTextColor,
  }), [
    availabilityText,
    availabilityTextColor,
    className,
    comingSoon,
    inventory,
    location,
    settings,
  ]);

  return (
    <SurroundPortals portalName={PRODUCT_LOCATION_STOCK_INFO} portalProps={portalProps}>
      <span className={classNames(defaultClassName, css(className).toString())}>
        <StockInfoInventory
          availabilityText={availabilityText}
          comingSoon={comingSoon}
          location={location}
          inventory={inventory}
          maxNumberVisible={settings.maxNumberOfVisibleInventory}
          aboveMaxExtension={settings.aboveMaxExtension}
        />
      </span>
    </SurroundPortals>
  );
};

StockInfoUnwrapped.defaultProps = {
  className: null,
};

export const StockInfo = connect(makeMapStateToProps)(StockInfoUnwrapped);
