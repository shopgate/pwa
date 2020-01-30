import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Store from './Store';
import { stores } from './style';

/**
 * Renders the locations where the product can be picked up.
 * @returns {JSX}
 */
function Locations({ context: Context }) {
  const { locations } = useContext(Context);

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

Locations.propTypes = {
  context: PropTypes.elementType.isRequired,
};

export default Locations;
