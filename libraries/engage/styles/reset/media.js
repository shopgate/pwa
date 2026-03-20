import { insertGlobalRule } from '../utils/globalStyles';

insertGlobalRule('audio:not([controls])', {
  display: 'none',
  height: 0,
});

insertGlobalRule('figure', {
  margin: 0,
});

insertGlobalRule('iframe', {
  border: 0,
  display: 'block',
  width: '100%',
});

insertGlobalRule('img, svg', {
  display: 'block',
  maxWidth: '100%',
});

insertGlobalRule('progress', {
  verticalAlign: 'baseline',
});
