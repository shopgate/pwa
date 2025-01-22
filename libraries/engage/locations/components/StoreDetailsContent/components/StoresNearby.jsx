import React from 'react';
import { useSelector } from 'react-redux';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeGetNearbyLocationsByRouteLocation } from '../../../selectors';
import StoresNearbyListItem from './StoresNearbyListItem';

const styles = {
  title: css({
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
  }),
};

/**
* Show stores nearby selected location
* @returns {JSX}
*/
const StoresNearby = () => {
  const nearbyLocations = useSelector(state => makeGetNearbyLocationsByRouteLocation()(state));

  return (
    <div>
      <div className={styles.title}>
        {i18n.text('location.storesNearby')}
      </div>
      {nearbyLocations.length > 0 && (
      <table>
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
