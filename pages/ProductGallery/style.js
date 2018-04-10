import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const fullSize = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const container = css({
  ...fullSize,
  background: colors.dark,
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}).toString();

const navButton = css({
  position: 'fixed',
  top: 'var(--safe-area-inset-top)',
  left: 0,
  width: variables.navigator.height,
  color: colors.light,
  zIndex: 2,
}).toString();

const slider = css({
  height: '100%',
}).toString();

const slide = css({
  position: 'relative',
  width: '100%',
  height: '100%',
}).toString();

const sliderStyles = {
  container: css({
    height: '100%',
  }).toString(),
  indicator: css({
    position: 'absolute',
    bottom: [
      '2px',
      'calc(2px + var(--safe-area-inset-bottom))',
    ],
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
  }).toString(),
};

export default {
  container,
  navButton,
  slider,
  slide,
  sliderStyles,
};
