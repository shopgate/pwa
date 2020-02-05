import React, { useContext } from 'react';
import StoreContext from './Store.context';
import StoreAddress from './StoreAddress';

/**
 * Renders the store's addresses as pickup locations.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Store() {
  const store = useContext(StoreContext);

  if (!store || !store.addresses || store.addresses.length === 0) {
    return null;
  }

  return store.addresses.map(address => (
    <StoreAddress address={address} key={address.code} />
  ));
}

export default Store;
