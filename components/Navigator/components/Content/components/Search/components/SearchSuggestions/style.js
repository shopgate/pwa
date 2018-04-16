import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  position: 'fixed',
  top: `calc(${variables.navigator.height}px + var(--safe-area-inset-top))`,
  borderTop: `${variables.gap.small / 2}px solid ${colors.shade8}`,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.light,
  overflowY: 'scroll',
}).toString();

const listItem = css({
  fontSize: '1rem',
  fontWeight: 400,
}).toString();

export default {
  container,
  listItem,
};
