import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { Button } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { historyPush } from '@shopgate/engage/core';
import formatDistance from '../../../helpers/formatDistance';
import { STORE_DETAILS_PATH } from '../../../constants';
import { StoreDetailsContext } from '../../../providers/StoreDetailsContext';

const useStyles = makeStyles()({
  button: {
    fontSize: '14px !important',
    padding: '0px !important',
  },
  locationRow: {
    borderBottom: '1px solid #e8e8e8',
    borderTop: '1px solid #e8e8e8',
    '> td:first-child > div': {
      paddingLeft: 0,
    },
    '> td:last-child > div': {
      paddingRight: 0,
    },
  },
  distance: {
    textWrapMode: 'nowrap',
    alignContent: 'center',
    verticalAlign: 'middle',
    fontWeight: '500',
  },
  makeMyStore: {
    textWrapMode: 'nowrap',
    alignContent: 'center',
    verticalAlign: 'middle',
  },
  storeInfo: {
    textWrapMode: 'nowrap',
    alignContent: 'center',
    verticalAlign: 'middle',
  },
  name: {
    textAlign: 'start',
  },
  cellContainer: {
    padding: '8px',
    textAlign: 'end',
  },
  cell: {
    verticalAlign: 'middle',
  },
  buttonContainer: {
    display: 'flex',
    gap: '4px 16px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
});

/**
* Shows a location in a row
* @param {Object} props Props
* @param {Object} props.location Location
* @returns {JSX}
*/
const StoresNearbyListItem = ({ location }) => {
  const { classes } = useStyles();
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
    <tr className={classes.locationRow}>
      <td className={classes.cell}>
        <div className={classes.cellContainer}>
          <div className={classes.name}>
            {name}
          </div>
        </div>
      </td>
      <td className={classes.cell}>
        <div className={classes.cellContainer}>
          <div className={classes.distance}>
            {formatDistance(distance || 0, unitSystem === 'imperial') }
          </div>
        </div>
      </td>
      <td className={classes.cell}>
        <div className={classes.cellContainer}>
          <div className={classes.buttonContainer}>
            <div className={classes.makeMyStore}>
              {(!isComingSoon) && (
                <Button className={classes.button} onClick={() => selectLocation(location, true)} role="button" type="primary" flat disabled={isPreferredLocation} wrapContent={false}>
                    {`${i18n.text('location.makeMyStore')}`}
                </Button>
              )}
              {isComingSoon && (
                <Button className={classes.button} role="button" type="primary" flat disabled wrapContent={false}>
                  {i18n.text('location.comingSoon')}
                </Button>
              )}
            </div>
            <div className={classes.storeInfo}>
              <Button className={classes.button} role="button" type="primary" flat onClick={() => openStoreDetails(code)} wrapContent={false}>
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
