import { insertGlobalRule } from '../utils/globalStyles';

insertGlobalRule('table', {
  borderCollapse: 'collapse',
  minWidth: '100%',
});

insertGlobalRule('td, th', {
  verticalAlign: 'top',
});
