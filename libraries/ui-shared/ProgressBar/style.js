import { css } from 'glamor';
import Color from 'color';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { getCSSCustomProp } from '@shopgate/engage/styles';

const { colors } = themeConfig;

const progressBarHeight = 4;

/**
 * Dynamically creates the class for the ProgressBar wrapper
 * @returns {string}
 */
const wrapper = () => css({
  position: 'absolute',
  bottom: 0,
  background: Color(getCSSCustomProp('--color-secondary') || colors.accent).fade(0.6),
  width: '100%',
  height: progressBarHeight,
  overflow: 'hidden',
  transition: 'transform 150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  zIndex: '10',
}).toString();

const innerElement = css({
  ':before': {
    content: '""',
    position: 'absolute',
    background: `var(--color-secondary, ${colors.accent})`,
    top: 0,
    left: 0,
    bottom: 0,
    willChange: 'left, right',
  },
  ':after': {
    content: '""',
    position: 'absolute',
    background: `var(--color-secondary, ${colors.accent})`,
    top: 0,
    left: 0,
    bottom: 0,
    willChange: 'left, right',
  },
}).toString();

const indeterminateLong = css.keyframes({
  '0%': {
    left: '-35%',
    right: '100%',
  },
  '60%': {
    left: '100%',
    right: '-90%',
  },
  '100%': {
    left: '100%',
    right: '-90%',
  },
});

const indeterminateShort = css.keyframes({
  '0%': {
    left: '-200%',
    right: '100%',
  },
  '60%': {
    left: '107%',
    right: '-8%',
  },
  '100%': {
    left: '107%',
    right: '-8%',
  },
});

const animating = css({
  ':before': {
    animation: `${indeterminateLong} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite`,
  },
  ':after': {
    animation: `${indeterminateShort} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite`,
    animationDelay: '1.15s',
  },
}).toString();

export default {
  wrapper,
  innerElement,
  animating,
};
