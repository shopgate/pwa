import { css } from 'glamor';

const duration = 150;
const easing = 'ease';

const slideInBaseDrawer = css.keyframes({
  '0%': { transform: 'translateY(100%)' },
  '100%': { transform: 'translateY(0)' },
});

const slideOutBaseDrawer = css.keyframes({
  '0%': { transform: 'translateY(0)' },
  '100%': { transform: 'translateY(100%)' },
});

const container = css({
  position: 'fixed',
  bottom: 0,
  left: 0,
  zIndex: 5,
}).toString();

const animation = {
  in: css({
    animation: `${slideInBaseDrawer} ${duration}ms 1 forwards ${easing}`,
  }).toString(),
  out: css({
    animation: `${slideOutBaseDrawer} ${duration}ms 1 forwards ${easing}`,
  }).toString(),
};

export default {
  container,
  animation,
};
