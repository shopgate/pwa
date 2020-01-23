import React, { useContext } from 'react';
import { stores } from './style';
import Store from './Store';
import StoreSelectorContext from './context';

/**
 * Renders the locations where the product can be picked up.
 * @returns {JSX}
 */
function Locations() {
  const { locations } = useContext(StoreSelectorContext);

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
