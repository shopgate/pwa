// @flow
import React from 'react';
import StoreAddressDistance from './StoreAddressDistance';
import { storeHeading, storeName } from './style';

type Props = {
  store: Object;
}

/**
 * Renders a single store address heading.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const StoreAddressHeading = ({ store }: Props) => {
  const { name, distance, unitSystem } = store;

  return (
    <div className={storeHeading}>
      <div className={storeName} data-test-id="store-name">{name}</div>
      <StoreAddressDistance distance={distance} unitSystem={unitSystem} />
    </div>
  );
};

export default StoreAddressHeading;
