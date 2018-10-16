import { css } from 'glamor';
import variables from 'Styles/variables';

const barHeight = 46;

const container = css({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: variables.gap.small,
  paddingBottom: `calc(${variables.gap.small}px + var(--safe-area-inset-bottom))`,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 0 30px rgba(0,0,0,0.1)',
});

const base = css({
  position: 'relative',
  height: barHeight,
});

const statusBar = css({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  maxWidth: '60%',
  padding: `0 ${variables.gap.small}px`,
});

const dummy = css({
  display: 'block',
  minHeight: `calc(${barHeight}px + ${variables.gap.small}px)`,
});

export default {
  container,
  base,
  statusBar,
  dummy,
};
