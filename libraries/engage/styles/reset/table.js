import { injectGlobal } from '..';

injectGlobal({
  table: {
    borderCollapse: 'collapse',
    minWidth: '100%',
  },
  'td, th': {
    verticalAlign: 'top',
  },
});
