import { css } from 'glamor';

const fadeOut = css.keyframes({
  '0%': { opacity: 1 },
  '99%': { opacity: 0.01, top: 0 },
  '100%': { opacity: 0, top: '-20%' },
});
const fadeIn = css.keyframes({
  '0%': { opacity: 0, top: '-20%' },
  '1%': { opacity: 0.01, top: 0 },
  '100%': { opacity: 1, top: 0 },
});

// todo: check if still in use
export const scrolledIn = css({
  '&&': {
    animation: `${fadeIn} .2s`,
    animationFillMode: 'forwards',
  },
}).toString();

export const scrolledOut = css({
  '&&': {
    animation: `${fadeOut} .2s`,
    animationFillMode: 'forwards',
  },
}).toString();
