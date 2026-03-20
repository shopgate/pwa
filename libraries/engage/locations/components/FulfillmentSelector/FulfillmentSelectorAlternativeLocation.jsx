import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withWidgetSettings } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables, themeConfig } from '@shopgate/pwa-common/helpers/config';
import { Grid, ResponsiveContainer, SurroundPortals } from '@shopgate/engage/components';
import { MERCHANT_SETTINGS_PRODUCT_SHOW_ALTERNATIVE_LOCATION } from '../../../core/constants';
import { provideProductAlternativeLocation } from '../../action-creators';
import { StockInfo } from '../StockInfo';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { PRODUCT_FULFILLMENT_SELECTOR_ALTERNATIVE_LOCATION } from '../../constants/Portals';
import { getProductAlternativeLocations } from '../../selectors';
import { SORT_CLOSEST_LOCATION_WITH_INVENTORY } from '../../constants';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  locationName: {
    color: 'var(--color-text-medium-emphasis)',
  },
  gridClassName: {
    fontSize: '0.825rem',
    padding: `0 ${themeVariables.gap.big}px ${themeVariables.gap.small}px ${themeVariables.gap.big * 3}px`,
  },
  itemColumn: {
    display: 'block',
    width: '50%',
    '&:first-of-type': {
      paddingRight: variables.gap.small,
    },
    '&:last-of-type': {
      textAlign: 'right',
    },
  },
  itemSpacer: {
    marginLeft: 16,
  },
});

/**
 * The FulfillmentSelectorLocation component
 * @returns {JSX}
 */
function FulfillmentSelectorAlternativeLocation({
  productId, show, alternativeLocations, provideAlternativeLocation, widgetSettings,
}) {
  const { classes } = useStyles();
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
        <Grid component="div" className={classes.gridClassName}>
          <ResponsiveContainer appAlways breakpoint="xs">
            <Grid.Item className={classes.itemColumn} grow={1} shrink={0} component="div">
              <div className={classes.locationName}>{alternativeLocation.name}</div>
            </Grid.Item>
            <Grid.Item className={classes.itemColumn} grow={1} shrink={0} component="div">
              <StockInfo productId={productId} location={alternativeLocation} />
            </Grid.Item>
          </ResponsiveContainer>
          <ResponsiveContainer webOnly breakpoint=">xs">
            <div className={classes.locationName}>
              {alternativeLocation.name}
              <span className={classes.itemSpacer}>
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
      radius: props.widgetSettings?.alternativeLocationOnPDP?.radius || 50,
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
