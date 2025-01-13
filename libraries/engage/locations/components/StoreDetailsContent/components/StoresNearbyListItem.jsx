import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import formatDistance from '../../../helpers/formatDistance';

const styles = {
  locationRow: css({
    borderBottom: '1px solid #e8e8e8',
    borderTop: '1px solid #e8e8e8',
  }),
  distance: css({
    textWrapMode: 'nowrap',
    padding: '8px',
    alignContent: 'center',
    verticalAlign: 'middle',
  }),
  makeMyStore: css({
    textWrapMode: 'nowrap',
    padding: '8px',
    alignContent: 'center',
    verticalAlign: 'middle',
  }),
  name: css({
    verticalAlign: 'middle',
    padding: '8px',
  }),
};

/**
* Shows a location in a row
* @param {Object} props Props
* @param {Object} props.location Location
* @returns {JSX}
*/
const StoresNearbyListItem = ({ location }) => {
  const { name, distance, unitSystem } = location;

  return (
    <tr className={styles.locationRow}>
      <td className={styles.name}>
        {name}
      </td>
      <td className={styles.distance}>
        {formatDistance(distance, unitSystem === 'imperial')}
      </td>
      <td className={styles.makeMyStore}>
        Make my Store
      </td>
    </tr>
  );
};

StoresNearbyListItem.propTypes = {
  location: PropTypes.shape({
    name: PropTypes.string,
    distance: PropTypes.number,
    unitSystem: PropTypes.string,
  }).isRequired,
};

export default StoresNearbyListItem;
