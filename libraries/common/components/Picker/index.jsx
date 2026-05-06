import React, { useEffect, forwardRef } from 'react';
import { logger } from '@shopgate/engage/core/helpers';
import { Picker } from '@shopgate/engage/components';

/**
 * @deprecated Use `import { Picker } from '@shopgate/engage/components'` instead.
 * @param {Object} props The component props.
 * @param {Object} ref Forwarded ref.
 * @returns {JSX}
 */
const DeprecatedPicker = forwardRef((props, ref) => {
  useEffect(() => {
    logger.warn(
      '===== Picker deprecated =====\n'
      + 'The Picker component '
      + '(@shopgate/pwa-common/components/Picker) is deprecated.\n'
      + 'Please use: import { Picker } from \'@shopgate/engage/components\'.\n'
      + '==================================='
    );
  }, []);

  return <Picker {...props} ref={ref} />;
});

export default DeprecatedPicker;
