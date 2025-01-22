import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { Link, Button } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { useDispatch, useSelector } from 'react-redux';
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
    fontWeight: '500',
  }),
  makeMyStore: css({
    textWrapMode: 'nowrap',
    alignContent: 'center',
    verticalAlign: 'middle',
  }),
  makeMyStoreButtonText: css({
    color: 'var(--color-primary)',
  }),
  name: css({
    verticalAlign: 'middle',
    alignContent: 'center',
  }),
  cellContainer: css({
    padding: '8px',
    textAlign: 'end',
  }),
  cell: css({
    verticalAlign: 'middle',
  }),
};

/**
* Shows a location in a row
* @param {Object} props Props
* @param {Object} props.location Location
* @returns {JSX}
*/
const StoresNearbyListItem = ({ location }) => {
  const dispatch = useDispatch();
  const preferredLocation = useSelector(getPreferredLocation);
  const {
    name, distance, unitSystem, code,
  } = location;

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
              <Button onClick={() => dispatch(selectLocation(location, true))} role="button" type="plain">
                <div className={styles.makeMyStoreButtonText}>
                  {i18n.text('location.makeMyStore')}
                </div>
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
};

export default StoresNearbyListItem;
