import React from 'react';
import PropTypes from 'prop-types';
import formatDistance from '../../helpers/formatDistance';
import { storeDistance } from './Store.style';

export const UNIT_SYSTEM_METRIC = 'metric';
export const UNIT_SYSTEM_IMPERIAL = 'imperial';

/**
 * Renders a single store distance.
 * @param {Object} props The component props.
 * @param {number} props.distance The distance.
 * @param {string} props.unitSystem The unit system.
 * @returns {JSX.Element}
 */
export function StoreDistance({ distance = null, unitSystem = UNIT_SYSTEM_METRIC }) {
  if (distance === null) {
    return null;
  }

  return (
    <span className={storeDistance}>
      {formatDistance(distance, unitSystem === UNIT_SYSTEM_IMPERIAL)}
    </span>
  );
}

StoreDistance.propTypes = {
  distance: PropTypes.number,
  unitSystem: PropTypes.string,
};

StoreDistance.defaultProps = {
  distance: null,
  unitSystem: UNIT_SYSTEM_METRIC,
};
