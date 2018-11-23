import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const barHeight = 46;

const container = css({
  background: colors.light,
  boxShadow: '0 0 30px rgba(0, 0, 0, 0.1)',
  paddingBottom: 'var(--safe-area-inset-bottom)',
});

const innerContainer = css({
  padding: variables.gap.small,
});

const base = css({
  height: barHeight,
  position: 'relative',
});

const statusBar = css({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  maxWidth: '60%',
  padding: `0 ${variables.gap.small}px`,
});

export default {
  container,
  innerContainer,
  base,
  statusBar,
};
