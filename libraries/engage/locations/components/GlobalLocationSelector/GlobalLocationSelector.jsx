import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  isLocationBasedShopping: getIsLocationBasedShopping(state),
  preferredLocation: getPreferredLocation(state),
});

/**
 * Global selector that forces the customer to choose a location
 * in location based shopping mode.
 * @param {Object} props Components props.
 * @return {Object}
 */
const GlobalLocationSelector = ({ isLocationBasedShopping, preferredLocation }) => {
  // Either when location based shopping is disabled or the customer
  // already chose a location we skip the dialog.
  if (!isLocationBasedShopping || !!preferredLocation) {
    return null;
  }

  return (
    <FulfillmentSheet
      stage={STAGE_SELECT_STORE}
      fulfillmentPath={MULTI_LINE_RESERVE}
      allowClose={false}
      isInitialized
      noProduct
      noInventory
      changeOnly
      open
    />
  );
};

GlobalLocationSelector.propTypes = {
  isLocationBasedShopping: PropTypes.bool,
  preferredLocation: PropTypes.shape(),
};

GlobalLocationSelector.defaultProps = {
  preferredLocation: null,
  isLocationBasedShopping: false,
};

export default connect(mapStateToProps)(GlobalLocationSelector);
