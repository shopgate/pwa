import React, { useContext } from 'react';
import FulfillmentContext from '../context';
import { variants } from './style';

/**
 * Renders the reserved product's selected variants.
 * @returns {JSX}
 */
function StoreListProductVariants() {
  const { selectedVariants } = useContext(FulfillmentContext);

  if (!selectedVariants || selectedVariants.length === 0) {
    return null;
  }

  return (
    <div className={variants} data-test-id="selected-variants">
      {variants.map(({ label, value }) => (
        <div key={`${label}-${value}`}>
          {`${label}: ${value}`}
        </div>
      ))}
    </div>
  );
}

export default StoreListProductVariants;
