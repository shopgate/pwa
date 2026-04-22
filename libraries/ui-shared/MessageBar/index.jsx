import React, { useEffect } from 'react';
import { logger } from '@shopgate/engage/core/helpers';
import { MessageBar } from '@shopgate/engage/components';

/**
 * @deprecated Use `import { MessageBar } from '@shopgate/engage/components'` instead.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const DeprecatedMessageBar = (props) => {
  useEffect(() => {
    logger.warn(
      '===== MessageBar deprecated =====\n'
      + 'The MessageBar component '
      + '(@shopgate/pwa-ui-shared/MessageBar) is deprecated.\n'
      + 'Please use: import { MessageBar } from \'@shopgate/engage/components\'.\n'
      + '==================================='
    );
  }, []);

  return <MessageBar {...props} />;
};

export default DeprecatedMessageBar;
