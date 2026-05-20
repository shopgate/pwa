import React, { useEffect } from 'react';
import { logger } from '@shopgate/engage/core/helpers';
import { RangeSlider } from '@shopgate/engage/components';

/**
 * @deprecated Use `import { RangeSlider } from '@shopgate/engage/components'` instead.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const DeprecatedRangeSlider = (props) => {
  useEffect(() => {
    logger.warn(
      '===== RangeSlider deprecated =====\n'
      + 'The RangeSlider component and its related components '
      + '(@shopgate/pwa-common/components/RangeSlider) are deprecated.\n'
      + 'Please use: import { RangeSlider } from \'@shopgate/engage/components\'.\n'
      + '==================================='
    );
  }, []);

  return <RangeSlider {...props} />;
};

export default DeprecatedRangeSlider;
