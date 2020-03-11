import React, { useContext } from 'react';
import Store from './Store';
import { FulfillmentContext } from '../../locations.context';
import StoreContext from './Store.context';
import { stores } from './style';

/**
 * Renders the locations where the product can be picked up.
 * @returns {JSX}
 */
function StoreListLocations() {
  const { locations } = useContext(FulfillmentContext);

  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <div className={stores}>
      {locations.map(location => (
        <StoreContext.Provider value={location} key={location.code}>
          <Store />
        </StoreContext.Provider>
      ))}
    </div>
  );
}

export default StoreListLocations;
