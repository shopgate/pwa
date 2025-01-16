import React from 'react';
import StoreDetails from './components/StoreDetails';
import StoreLocationMap from './components/StoreLocationMap';
import StoresNearby from './components/StoresNearby';
import FindMoreStores from './components/FindMoreStores';

/**
 * @param {Object} props .
 * @returns {JSX}
 */
const StoreDetialsContent = () => (
  <div>
    <StoreDetails />
    <StoreLocationMap />
    <StoresNearby />
    <FindMoreStores />
  </div>

);

export default StoreDetialsContent;
