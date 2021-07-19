import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withWidgetSettings } from '@shopgate/engage/core';
import { Grid, ResponsiveContainer, SurroundPortals } from '@shopgate/engage/components';
import { MERCHANT_SETTINGS_PRODUCT_SHOW_ALTERNATIVE_LOCATION } from '../../../core/constants';
import { provideProductAlternativeLocation } from '../../action-creators';
import { StockInfo } from '../StockInfo';
import { locationName, alternativeLocation as gridClassName } from './FulfillmentSelectorLocation.style';
import { itemColumn, itemSpacer } from './FulfillmentSelectorItem.style';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { PRODUCT_FULFILLMENT_SELECTOR_ALTERNATIVE_LOCATION } from '../../constants/Portals';
import { getProductAlternativeLocations } from '../../selectors';
import { SORT_CLOSEST_LOCATION_WITH_INVENTORY } from '../../constants';

/**
 * The FulfillmentSelectorLocation component
 * @returns {JSX}
 */
function FulfillmentSelectorAlternativeLocation({
  productId, show, alternativeLocations, provideAlternativeLocation, widgetSettings,
}) {
  const { merchantSettings = {}, selectedLocation } = useFulfillmentSelectorState();
  const { alternativeLocationOnPDP: { radius = 50 } = {} } = widgetSettings || {};

  const showAlternative =
    merchantSettings[MERCHANT_SETTINGS_PRODUCT_SHOW_ALTERNATIVE_LOCATION] || false;

  useEffect(() => {
    if (show && showAlternative && productId && !alternativeLocations) {
      provideAlternativeLocation(productId, {
        sort: SORT_CLOSEST_LOCATION_WITH_INVENTORY,
        radius,
      });
    }
  }, [
    productId,
    provideAlternativeLocation,
    alternativeLocations,
    radius,
    show,
    showAlternative,
  ]);

  if (!show || !showAlternative || !productId) {
    return null;
  }

  if (!alternativeLocations || !alternativeLocations.length) {
    return null;
  }

  const alternativeLocation = alternativeLocations.find(l => l.code !== selectedLocation?.code);

  return (
    <SurroundPortals
      portalName={PRODUCT_FULFILLMENT_SELECTOR_ALTERNATIVE_LOCATION}
      portalProps={{
        productId,
        location: alternativeLocation,
      }}
    >
      {alternativeLocation && (
        <Grid component="div" className={gridClassName}>
          <ResponsiveContainer appAlways breakpoint="xs">
            <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
              <div className={locationName}>{alternativeLocation.name}</div>
            </Grid.Item>
            <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
              <StockInfo productId={productId} location={alternativeLocation} />
            </Grid.Item>
          </ResponsiveContainer>
          <ResponsiveContainer webOnly breakpoint=">xs">
            <div className={locationName}>
              {alternativeLocation.name}
              <span className={itemSpacer}>
                <StockInfo productId={productId} location={alternativeLocation} />
              </span>
            </div>
          </ResponsiveContainer>
        </Grid>
      )}
    </SurroundPortals>
  );
}

FulfillmentSelectorAlternativeLocation.propTypes = {
  provideAlternativeLocation: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  alternativeLocations: PropTypes.arrayOf(PropTypes.shape()),
  productId: PropTypes.string,
  widgetSettings: PropTypes.shape(),
};

FulfillmentSelectorAlternativeLocation.defaultProps = {
  alternativeLocations: null,
  productId: null,
  widgetSettings: null,
};

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object}
 */
const mapStateToProps = (state, props) => ({
  alternativeLocations: getProductAlternativeLocations(state, {
    productId: props.productId,
    params: {
      sort: SORT_CLOSEST_LOCATION_WITH_INVENTORY,
      radius: props.widgetSettings.radius || 50,
    },
  }),
});

const mapDispatchToProps = {
  provideAlternativeLocation: provideProductAlternativeLocation,
};

export default withWidgetSettings(
  connect(mapStateToProps, mapDispatchToProps)(
    memo(FulfillmentSelectorAlternativeLocation)
  ),
  '@shopgate/engage/locations'
);
