import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { Link, Button } from '@shopgate/engage/components';
import { connect } from 'react-redux';
import formatDistance from '../../../helpers/formatDistance';
import { STORE_DETAILS_PATH } from '../../../constants';
import { selectLocation } from '../../../action-creators';
import { getPreferredLocation } from '../../../selectors';

const styles = {
  locationRow: css({
    borderBottom: '1px solid #e8e8e8',
    borderTop: '1px solid #e8e8e8',
  }),
  distance: css({
    textWrapMode: 'nowrap',
    alignContent: 'center',
    verticalAlign: 'middle',
  }),
  makeMyStore: css({
    textWrapMode: 'nowrap',
    alignContent: 'center',
    verticalAlign: 'middle',
  }),
  name: css({
    verticalAlign: 'middle',
    alignContent: 'center',
  }),
  cellContainer: css({
    padding: '8px',
  }),
  cell: css({
    verticalAlign: 'middle',
  }),
};

/**
 * Maps state to props
 * @param {Object} state State
 * @returns {Object}
 */
const mapStateToProps = state => ({
  preferredLocation: getPreferredLocation(state),
});

/**
 * Maps dispatch to props
 * @param {Function} dispatch Dispatch
 * @returns {Object}
 * */
const mapDispatchToProps = dispatch => ({
  setLocation: location => dispatch(selectLocation(location, true)),
});

/**
* Shows a location in a row
* @param {Object} props Props
* @param {Object} props.location Location
* @returns {JSX}
*/
const StoresNearbyListItem = ({ location, setLocation, preferredLocation }) => {
  const {
    name, distance, unitSystem, code,
  } = location;
  console.log('sasa:66: location', location);

  const isPreferredLocation = preferredLocation && preferredLocation.code === code;

  return (
    <tr className={styles.locationRow}>
      <td className={styles.cell}>
        <div className={styles.cellContainer}>
          <Link href={`${STORE_DETAILS_PATH}/${code}`}>
            <div className={styles.name}>
              {name}
            </div>
          </Link>
        </div>
      </td>
      <td className={styles.cell}>
        <div className={styles.cellContainer}>
          <div className={styles.distance}>
            {formatDistance(distance || 0, unitSystem === 'imperial') }
          </div>
        </div>
      </td>
      <td className={styles.cell}>
        <div className={styles.cellContainer}>
          {!isPreferredLocation && (
            <div className={styles.makeMyStore}>
              <Button onClick={() => setLocation(location)} role="button" type="plain">
              Make my Store
              </Button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

StoresNearbyListItem.propTypes = {
  location: PropTypes.shape({
    name: PropTypes.string,
    distance: PropTypes.number,
    unitSystem: PropTypes.string,
    code: PropTypes.string,
  }).isRequired,
  setLocation: PropTypes.func.isRequired,
  preferredLocation: PropTypes.shape({
    code: PropTypes.string,
  }),

};
StoresNearbyListItem.defaultProps = {
  preferredLocation: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(StoresNearbyListItem);
