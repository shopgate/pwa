import React, { useContext, useMemo } from 'react';
import { Grid, LocationIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { StoreContext } from './Store.context';
import { StoreFinderContext } from '../../locations.context';
import { StoreDistance } from '../StoreList/StoreDistance';
import { StoreHoursToday } from '../StoreList/StoreHoursToday';
import { StoreAddress } from '../StoreList/StoreAddress';
import StoreFinderLocationHeaderPhoneNumber from './StoreFinderLocationHeaderPhoneNumber';

const useStyles = makeStyles()(theme => ({
  container: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.secondary,
    ' > *': {
      margin: 0,
    },
    ' svg': {
      color: theme.palette.text.secondary,
    },
    ' li': {
      paddingTop: 0,
    },
    ' a': {
      color: 'var(--color-primary)',
      textDecoration: 'underline',
    },
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    ' > *:not(:last-child)': {
      paddingBottom: theme.spacing(0.5),
      paddingTop: 0,
    },
  },
  clickable: {
    ' > *': {
      margin: 0,
      paddingTop: 0,
    },
    ' > *:not(:last-child)': {
      paddingBottom: theme.spacing(0.5),
      paddingTop: 0,
    },
  },
  storeName: {
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  myStoreWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  myStore: {
    color: 'var(--color-primary)',
    fontSize: '1rem',
    fontWeight: 500,
  },
  myStoreIcon: {
    ' svg': {
      color: 'var(--color-primary)',
    },
    marginRight: '4px',
  },
  storeNameWrapper: {
    flexWrap: 'wrap',
    display: 'flex',
    gap: '2px 12px',
  },
  storeDistance: {
    lineHeight: '1.65rem',
    paddingLeft: theme.spacing(1),
  },
  storeHoursToday: {
    ' > *': {
      color: theme.palette.text.secondary,
    },
  },
}));

/**
 * @returns {JSX}
 */
const StoreFinderLocationHeader = () => {
  const { classes } = useStyles();
  const store = useContext(StoreContext);
  const {
    name, distance, unitSystem, operationHours, address,
  } = store;
  const { selectedLocation } = useContext(StoreFinderContext);

  const isSelectedLocation = useMemo(() =>
    selectedLocation?.code === store?.code,
  [selectedLocation, store]);

  return (
    <div className={classes.container}>
      <div className={classes.clickable}>
        <Grid>
          <Grid.Item grow={1}>
            <div className={classes.storeNameWrapper}>
              <div className={classes.storeName}>
                { name }
              </div>
              {isSelectedLocation && (
                <div className={classes.myStoreWrapper}>
                  <div className={classes.myStoreIcon}>
                    <LocationIcon size={20} />
                  </div>
                  <div className={classes.myStore}>
                    {i18n.text('location.myStore')}
                  </div>
                </div>
              )}
            </div>
          </Grid.Item>
          <Grid.Item className={classes.storeDistance}>
            <StoreDistance distance={distance} unitSystem={unitSystem} />
          </Grid.Item>
        </Grid>
        <div className={classes.storeHoursToday}>
          <StoreHoursToday hours={operationHours} />
        </div>
        <StoreAddress address={address} />
      </div>
      <StoreFinderLocationHeaderPhoneNumber phone={address.phoneNumber} />
    </div>
  );
};

export default StoreFinderLocationHeader;
