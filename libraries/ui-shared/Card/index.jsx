import React, { useEffect } from 'react';
import { logger } from '@shopgate/engage/core/helpers';
import { Card } from '@shopgate/engage/components';

/**
 * @deprecated Use `import { Card } from '@shopgate/engage/components'` instead.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const DeprecatedCard = (props) => {
  useEffect(() => {
    logger.warn(
      '===== Card deprecated =====\n'
      + 'The Card component '
      + '(@shopgate/pwa-ui-shared/Card) is deprecated.\n'
      + 'Please use: import { Card } from \'@shopgate/engage/components\'.\n'
      + '==================================='
    );
  }, []);

  return <Card {...props} />;
};

export default DeprecatedCard;
