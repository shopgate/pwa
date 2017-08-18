import cxs from 'cxs';
import { navigator, gap } from '../../../../styles/variables';
import { shade8, light } from '../../../../styles/colors';

const container = cxs({
  position: 'fixed',
  top: navigator.height,
  borderTop: `${gap.small / 2}px solid ${shade8}`,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: light,
  overflowY: 'scroll',
});

const listItem = cxs({
  fontSize: '1rem',
  fontWeight: 400,
});

export default {
  container,
  listItem,
};
