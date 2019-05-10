import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

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

const slider = css({
  height: '100%',
}).toString();

const slide = css({
  position: 'relative',
  width: '100%',
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
  slider,
  slide,
  sliderStyles,
};
