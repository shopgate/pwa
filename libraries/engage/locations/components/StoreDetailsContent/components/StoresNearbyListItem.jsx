import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { Link, Button } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import formatDistance from '../../../helpers/formatDistance';
import { STORE_DETAILS_PATH } from '../../../constants';
import { StoreDetailsContext } from '../../../providers/StoreDetailsContext';

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
  storeInfo: css({
    textWrapMode: 'nowrap',
    alignContent: 'center',
    verticalAlign: 'middle',
  }),
  storeInfoButtonText: css({
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
  buttonContainer: css({
    display: 'flex',
    gap: '4px 16px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  }),
  comingSoon: css({
  }),
};

/**
* Shows a location in a row
* @param {Object} props Props
* @param {Object} props.location Location
* @returns {JSX}
*/
const StoresNearbyListItem = ({ location }) => {
  const { preferredLocation, selectLocation } = useContext(StoreDetailsContext);
  const {
    name, distance, unitSystem, code, isComingSoon,
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
          <div className={styles.buttonContainer}>
            {!isPreferredLocation && (
            <div className={styles.makeMyStore}>
                {(!isComingSoon && !isPreferredLocation) && (
                <Button onClick={() => selectLocation(location, true)} role="button" type="plain">
                  <div className={styles.makeMyStoreButtonText}>
                    {i18n.text('location.makeMyStore')}
                  </div>
                </Button>
                )}
              {isComingSoon && (
              <div className={styles.comingSoon}>
                {i18n.text('location.comingSoon')}
              </div>
              )}
            </div>
            )}
            <div className={styles.storeInfo}>
              <Button role="button" type="plain">
                <div className={styles.storeInfoButtonText}>
                  {i18n.text('locations.details')}
                </div>
              </Button>
            </div>
          </div>
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
    isComingSoon: PropTypes.bool,
  }).isRequired,
};

export default StoresNearbyListItem;
