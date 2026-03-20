/**
 * @deprecated used @shopgate/engage/styles instead
 */

import { insertGlobalRule } from '@shopgate/engage/styles/utils/globalStyles';

insertGlobalRule('table', {
  borderCollapse: 'collapse',
  minWidth: '100%',
});

insertGlobalRule('td, th', {
  verticalAlign: 'top',
});
