import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  position: 'absolute',
  width: '100%',
  margin: `0 0 0 -${variables.gap.big}px`,
  top: '4px',
}).toString();

const input = css({
  display: 'block',
  position: 'relative',
  width: '100%',
  fontSize: '1rem',
  border: `1px ${colors.shade7} solid`,
  padding: `0 ${variables.gap.big}px`,
  background: colors.light,
  lineHeight: '19px',
  height: '46px',
  borderRadius: '2px',
  outline: 'none',
  WebkitAppearance: 'none',
}).toString();

const overlay = css({
  position: 'fixed',
  top: variables.navigator.height,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  zIndex: 10,
}).toString();


const slideInSearchBar = css.keyframes({
  '0%': {
    transform: 'translate3d(100vw, 0, 0)',
    opacity: 0.5,
  },
  '100%': { transform: 'translate3d(0, 0, 0)' },
});

const slideOutSearchBar = css.keyframes({
  '0%': { transform: 'translate3d(0, 0, 0)' },
  '100%': { transform: 'translate3d(100vw, 0, 0)' },
});

const animation = {
  in: css({
    animation: `${slideInSearchBar} 150ms 1 both cubic-bezier(0.25, 0.1, 0.25, 1)`,
  }).toString(),
  out: css({
    animation: `${slideOutSearchBar} 150ms 1 both ease-in`,
  }).toString(),
};

const fadeInOverlay = css.keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const fadeOutOverlay = css.keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const overlayAnimation = {
  in: css({
    animation: `${fadeInOverlay} 150ms 1`,
  }).toString(),
  out: css({
    animation: `${fadeOutOverlay} 150ms 1`,
  }).toString(),
};

export default {
  container,
  input,
  animation,
  overlay,
  overlayAnimation,
};
