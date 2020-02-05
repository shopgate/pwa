import React from 'react';
import { availability, availabilityText, availabilityStores } from './style';

/**
 * Renders the product's availability
 * @returns {JSX}
 */
function StoreListProductAvailability() {
  return (
    <div className={availability}>
      <div className={availabilityText}>Ready for pick up in 1-3 days in</div>
      <div className={availabilityStores}>13 Stores</div>
    </div>
  );
}

export default StoreListProductAvailability;
