// @flow
import React from 'react';
import formatDistance from '../../helpers/formatDistance';
import { storeDistance } from './style';

type Props = {
  distance?: number;
  unitSystem?: string;
}

export const UNIT_SYSTEM_METRIC = 'metric';
export const UNIT_SYSTEM_IMPERIAL = 'imperial';

/**
 * Renders a single store distance.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const StoreAddressDistance = ({ distance = null, unitSystem = UNIT_SYSTEM_METRIC }: Props) => {
  if (distance === null) {
    return null;
  }

  return (
    <span className={storeDistance}>
      {formatDistance(distance, unitSystem === UNIT_SYSTEM_IMPERIAL)}
    </span>
  );
};

StoreAddressDistance.defaultProps = {
  distance: null,
  unitSystem: UNIT_SYSTEM_METRIC,
};

export default StoreAddressDistance;
