import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { Button } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { historyPush } from '@shopgate/engage/core';
import formatDistance from '../../../helpers/formatDistance';
import { STORE_DETAILS_PATH } from '../../../constants';
import { StoreDetailsContext } from '../../../providers/StoreDetailsContext';

const styles = {
  button: css({
    fontSize: '14px !important',
    padding: '0px !important',
  }),
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
  storeInfo: css({
    textWrapMode: 'nowrap',
    alignContent: 'center',
    verticalAlign: 'middle',
  }),
  name: css({
    textAlign: 'start',
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
};

/**
* Shows a location in a row
* @param {Object} props Props
* @param {Object} props.location Location
* @returns {JSX}
*/
const StoresNearbyListItem = ({ location }) => {
  const dispatch = useDispatch();
  const { preferredLocation, selectLocation } = useContext(StoreDetailsContext);
  const {
    name, distance, unitSystem, code, isComingSoon,
  } = location;

  const isPreferredLocation = preferredLocation && preferredLocation.code === code;

  /**
   * Opens the store details page
   * @param {string} locationCode Location code
   */
  const openStoreDetails = (locationCode) => {
    dispatch(historyPush({ pathname: `${STORE_DETAILS_PATH}/${locationCode}` }));
  };

  return (
    <tr className={styles.locationRow}>
      <td className={styles.cell}>
        <div className={styles.cellContainer}>
          <div className={styles.name}>
            {name}
          </div>
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
            <div className={styles.makeMyStore}>
              {(!isComingSoon) && (
                <Button className={styles.button} onClick={() => selectLocation(location, true)} role="button" type="primary" flat disabled={isPreferredLocation}>
                    {`${i18n.text('location.makeMyStore')}`}
                </Button>
              )}
              {isComingSoon && (
                <Button className={styles.button} role="button" type="primary" flat disabled>
                  {i18n.text('location.comingSoon')}
                </Button>
              )}
            </div>
            <div className={styles.storeInfo}>
              <Button className={styles.button} role="button" type="primary" flat onClick={() => openStoreDetails(code)}>
                {i18n.text('locations.details')}
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
