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

const backdrop = css({
  top: `calc(${variables.navigator.height}px + var(--safe-area-inset-top))`,
}).toString();

export default {
  backdrop,
  container,
  input,
  animation,
};
