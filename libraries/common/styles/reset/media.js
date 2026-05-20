/**
 * @deprecated used @shopgate/engage/styles/reset instead
 */

import { injectGlobal } from '@shopgate/engage/styles';

injectGlobal({
  'audio:not([controls])': {
    display: 'none',
    height: 0,
  },
  figure: {
    margin: 0,
  },
  iframe: {
    border: 0,
    display: 'block',
    width: '100%',
  },
  'img, svg': {
    display: 'block',
    maxWidth: '100%',
  },
  progress: {
    verticalAlign: 'baseline',
  },
});
