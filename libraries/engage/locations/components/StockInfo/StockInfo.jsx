import * as React from 'react';
import { connect } from 'react-redux';
import defaultsDeep from 'lodash/defaultsDeep';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@shopgate/engage/styles';
import { makeGetLocationInventory } from '../../selectors';
import { getThemeSettings } from '../../../core';
import { SurroundPortals } from '../../../components';
import { PRODUCT_LOCATION_STOCK_INFO } from '../../constants';
import { getAvailabilitySettings } from '../../helpers';
import { createStockInfoDefaultSettings } from './StockInfo.defaultSettings';
import { StockInfoInventory } from './StockInfoInventory';

const useStyles = makeStyles()((theme, { availabilityTextColor }) => ({
  defaultClassName: {
    color: availabilityTextColor,
    fontSize: '0.75rem',
    margin: 0,
    ':not(:empty) ~ *': {
      marginLeft: 14,
    },
  },
}));

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
const StockInfoUnwrapped = ({ location, inventory, className }) => {
  const theme = useTheme();
  const { locationStockInfo } = getThemeSettings('product') || {};
  const settings = React.useMemo(
    () => defaultsDeep(locationStockInfo, createStockInfoDefaultSettings(theme)),
    [locationStockInfo, theme]
  );

  const { availabilityText = '', availabilityTextColor = 'inherit', comingSoon = false } =
    getAvailabilitySettings(settings, location, inventory);

  const { classes, cx, css } = useStyles({ availabilityTextColor });

  /**
   * Matches pre–makeStyles: classNames(defaultClassName, css(className).toString()).
   * String class names are passed through; objects are turned into an Emotion class via css().
   */
  let customClassName;
  if (className == null) {
    customClassName = undefined;
  } else if (typeof className === 'string') {
    customClassName = className;
  } else {
    customClassName = css(className);
  }

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
      <span className={cx(classes.defaultClassName, customClassName)}>
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

StockInfoUnwrapped.propTypes = {
  location: PropTypes.shape().isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  inventory: PropTypes.shape(),
};

StockInfoUnwrapped.defaultProps = {
  className: null,
  inventory: null,
};

export const StockInfo = connect(makeMapStateToProps)(StockInfoUnwrapped);
