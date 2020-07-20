import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { selectGlobalLocation } from '@shopgate/engage/locations/action-creators';
import { getPreferredLocation } from '../../selectors';
import { getIsLocationBasedShopping } from '../../../core/selectors';
import { FulfillmentSheet } from '../FulfillmentSheet';
import { STAGE_SELECT_STORE, MULTI_LINE_RESERVE } from '../../constants';

/**
 * Maps state to props.
 * @param {Object} state State
 * @param {Object} props Props
 * @return {Object}
 */
const mapStateToProps = state => ({
  currentRoute: getCurrentRoute(state),
  isLocationBasedShopping: getIsLocationBasedShopping(state),
  preferredLocation: getPreferredLocation(state),
});

/**
 * Maps the contents of the state to the component props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  selectGlobalLocation,
};

/**
 * Global selector that forces the customer to choose a location
 * in location based shopping mode.
 * @param {Object} props Components props.
 * @return {Object}
 */
const GlobalLocationSelector = ({
  isLocationBasedShopping,
  preferredLocation,
  selectGlobalLocation: selectLocation,
  routePatternAllowList,
  currentRoute,
}) => {
  const closeSheetHandler = useCallback((location) => {
    if (location) {
      selectLocation(location);
    }
  }, [selectLocation]);

  const renderComponent = useMemo(() => {
    if (!currentRoute) {
      return false;
    }

    const { pattern } = currentRoute || {};

    if (routePatternAllowList && !routePatternAllowList.includes(pattern)) {
      return false;
    }

    // Either when location based shopping is disabled or the customer
    // already chose a location we skip the dialog.
    return isLocationBasedShopping && !preferredLocation;

    // routePatternBlacklist.includes(pattern),
  }, [currentRoute, isLocationBasedShopping, preferredLocation, routePatternAllowList]);

  if (!renderComponent) {
    return null;
  }

  return (
    <FulfillmentSheet
      stage={STAGE_SELECT_STORE}
      fulfillmentPath={MULTI_LINE_RESERVE}
      allowClose={false}
      onClose={closeSheetHandler}
      isInitialized
      noProduct
      noInventory
      changeOnly
      open
    />
  );
};

GlobalLocationSelector.propTypes = {
  selectGlobalLocation: PropTypes.func.isRequired,
  currentRoute: PropTypes.shape(),
  isLocationBasedShopping: PropTypes.bool,
  preferredLocation: PropTypes.shape(),
  routePatternAllowList: PropTypes.arrayOf(PropTypes.string),
};

GlobalLocationSelector.defaultProps = {
  preferredLocation: null,
  isLocationBasedShopping: false,
  routePatternAllowList: null,
  currentRoute: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalLocationSelector);
