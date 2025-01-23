import React, { useContext } from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core/helpers';
import StoresNearbyListItem from './StoresNearbyListItem';
import { StoreDetailsContext } from '../../../providers/StoreDetailsContext';

const styles = {
  title: css({
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  }),
};

/**
* Show stores nearby selected location
* @returns {JSX}
*/
const StoresNearby = () => {
  const { nearbyLocations } = useContext(StoreDetailsContext);

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
