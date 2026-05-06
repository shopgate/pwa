import React, { useEffect } from 'react';
import { logger } from '@shopgate/engage/core/helpers';
import { ProductCharacteristics } from '@shopgate/engage/product/components';

/**
 * @deprecated Use `import { ProductCharacteristics } from '@shopgate/engage/product/components'`.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const DeprecatedProductCharacteristics = (props) => {
  useEffect(() => {
    logger.warn(
      '===== ProductCharacteristics deprecated =====\n'
      + 'The ProductCharacteristics component '
      + '(@shopgate/pwa-common/components/ProductCharacteristics) is deprecated.\n'
      + 'Please use: import { ProductCharacteristics } from \'@shopgate/engage/product/components\'.\n'
      + '==================================='
    );
  }, []);

  return <ProductCharacteristics {...props} />;
};

export default DeprecatedProductCharacteristics;
