import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { css } from 'glamor';
import classNames from 'classnames';
import defaultsDeep from 'lodash/defaultsDeep';
import I18n from '@shopgate/pwa-common/components/I18n';
import { PRODUCT_LOCATION_STOCK_INFO } from '../../constants/Portals';
import { SurroundPortals } from '../../../components';
import { getThemeSettings } from '../../../core/config/getThemeSettings';
import { capitalize } from '../../../core/helpers/string';
import defaultSettings from './defaultSettings';
import getAvailabilitySettings from './getAvailabilitySettings';

/**
 * The Availability component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const LocationStockInfo = ({ location, className, showStoreName }) => {
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
      {(location.visibleInventory !== null || location.storeName) &&
        <span className={classNames(`${defaultClassName}`, `${className}`)}>
          {location.visibleInventory !== null &&
            <Fragment>
              <I18n.Text
                string={availabilityText}
                params={{
                  // Limit stock to max visible stock if it is set
                  visibleInventory: (
                    settings.maxNumberOfVisibleInventory &&
                      location.visibleInventory > settings.maxNumberOfVisibleInventory
                      ? `${settings.maxNumberOfVisibleInventory}${settings.aboveMaxExtension}`
                      : location.visibleInventory
                  ),
                }}
              />
              &nbsp;
            </Fragment>
          }
          { showStoreName &&
            <I18n.Text
              string="product.location_stock_info.pick_up_at"
              params={{ storeName: location.name }}
              transform={
                (location.visibleInventory === null || !availabilityText)
                  ? capitalize
                  : null
              }
            />
          }
        </span>
      }
    </SurroundPortals>
  );
};

LocationStockInfo.propTypes = {
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

LocationStockInfo.defaultProps = {
  className: '',
  showStoreName: true,
};

export default pure(LocationStockInfo);
