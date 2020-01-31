import React, { useContext } from 'react';
import Store from './Store';
import FulfillmentContext from '../context';
import { stores } from './style';

/**
 * Renders the locations where the product can be picked up.
 * @returns {JSX}
 */
function Locations() {
  const { locations } = useContext(FulfillmentContext);

  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <div className={stores}>
      {locations.map(location => (
        <Store store={location} key={location.code} />
      ))}
    </div>
  );
}

export default Locations;
