import React, { useContext } from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import StoresNearbyListItem from './StoresNearbyListItem';
import { StoreDetailsContext } from '../../../providers/StoreDetailsContext';

const useStyles = makeStyles()({
  title: {
    marginBottom: 12,
  },
  table: {
    width: '100%',
  },
});

/**
* Show stores nearby selected location
* @returns {JSX}
*/
const StoresNearby = () => {
  const { classes } = useStyles();
  const { nearbyLocations } = useContext(StoreDetailsContext);

  return (
    <div>
      <Typography variant="h3" component="div" className={classes.title}>
        {i18n.text('location.storesNearby')}
      </Typography>
      {nearbyLocations.length > 0 && (
      <table className={classes.table}>
        <tbody>
          {nearbyLocations.map(location => (
            <StoresNearbyListItem location={location} key={location.code} />
          )) }
        </tbody>
      </table>
      )}
      {nearbyLocations.length === 0 && (
      <div>
        {i18n.text('location.noStoresNearby')}
      </div>
      )}
    </div>
  );
};

export default StoresNearby;
