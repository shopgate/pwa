import React, { useContext, useMemo } from 'react';
import { i18n } from '@shopgate/engage/core';
import { StoreFinderContext } from '../../locations.context';
import { container } from './StoreFinderStoresNear.style';

/**
 * @returns {JSX}
 */
const StoreFinderStoresNear = () => {
  const { userSearch, locations } = useContext(StoreFinderContext);

  const hasZipCode = !!userSearch?.postalCode;
  const hasGeolocation = !!userSearch?.geolocation;

  const text = useMemo(() => {
    if (hasZipCode) {
      return i18n.text('locations.stores_near.zip_code', { zipCode: userSearch.postalCode });
    } if (hasGeolocation) {
      return i18n.text('locations.stores_near.location');
    }

    return '';
  }, [hasGeolocation, hasZipCode, userSearch.postalCode]);

  if ((!hasZipCode && !hasGeolocation) || locations.length === 0) {
    return (<div className={container} />);
  }

  return (
    <div className={container}>
      { text }
    </div>
  );
};

export default StoreFinderStoresNear;
