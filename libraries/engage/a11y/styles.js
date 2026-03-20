import { insertGlobalRule } from '../styles/utils/globalStyles';

// global class for screen readers only, visually hidden
insertGlobalRule('.sr-only', {
  border: '0',
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0',
  position: 'absolute',
  width: '1px',
  whiteSpace: 'nowrap',
  top: 0,
  left: 0,
});
