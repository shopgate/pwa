import React from 'react';
import PropTypes from 'prop-types';
import { variants } from './style';
import connect from './StoreListProductVariants.connector';

/**
 * Renders the reserved product's selected variants.
 * @returns {JSX}
 */
function StoreListProductVariants({ selectedVariants }) {
  if (!selectedVariants || selectedVariants.length === 0) {
    return null;
  }

  return (
    <div className={variants} data-test-id="selected-variants">
      {selectedVariants.map(({ label, value }) => (
        <div key={`${label}-${value}`}>
          {`${label}: ${value}`}
        </div>
      ))}
    </div>
  );
}

StoreListProductVariants.propTypes = {
  selectedVariants: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
};

StoreListProductVariants.defaultProps = {
  selectedVariants: [],
};

export default connect(StoreListProductVariants);
