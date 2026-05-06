/**
 * @deprecated used @shopgate/engage/styles instead
 */

import { injectGlobal } from '@shopgate/engage/styles';

injectGlobal({
  table: {
    borderCollapse: 'collapse',
    minWidth: '100%',
  },
  'td, th': {
    verticalAlign: 'top',
  },
});
