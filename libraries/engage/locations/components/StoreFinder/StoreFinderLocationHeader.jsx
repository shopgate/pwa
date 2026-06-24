import React, { useContext, useMemo } from 'react';
import { Grid, LocationIcon, Typography } from '@shopgate/engage/components';
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
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
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
  myStoreWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  myStoreIcon: {
    ' svg': {
      color: theme.palette.primary.main,
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
    <Typography variant="body2" component="div" color="textSecondary" className={classes.container}>
      <div className={classes.clickable}>
        <Grid>
          <Grid.Item grow={1}>
            <div className={classes.storeNameWrapper}>
              <Typography variant="h4" component="div" color="textPrimary">
                { name }
              </Typography>
              {isSelectedLocation && (
                <div className={classes.myStoreWrapper}>
                  <div className={classes.myStoreIcon}>
                    <LocationIcon size={20} />
                  </div>
                  <Typography variant="h4" component="div" color="primary">
                    {i18n.text('location.myStore')}
                  </Typography>
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
    </Typography>
  );
};

export default StoreFinderLocationHeader;
