import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const header = css({
  background: colors.light,
  height: `calc(${variables.navbar.height}px + var(--safe-area-inset-top))`,
  left: 0,
  paddingTop: 'var(--safe-area-inset-top)',
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: 2,
});

const grid = css({
  alignItems: 'center',
  height: '100%',
}).toString();

const title = css({
  alignItems: 'center',
  display: 'flex',
  fontSize: '1.25rem',
  fontWeight: 500,
  height: '100%',
  padding: `0 ${variables.gap.big}`,
  position: 'relative',
}).toString();

const portal = css({
  height: '100%',
});

export default {
  header,
  grid,
  title,
  portal,
};
