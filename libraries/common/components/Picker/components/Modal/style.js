import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const fadeDuration = 150;
const slideDuration = 150;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const slideInPickerModal = css.keyframes({
  '0%': { transform: 'translateY(100%)' },
  '100%': { transform: 'translateY(0)' },
});

const slideOutPickerModal = css.keyframes({
  '0%': { transform: 'translateY(0)' },
  '100%': { transform: 'translateY(100%)' },
});

const fadeInPickerBackground = css.keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 0.5 },
});

const fadeOutPickerBackground = css.keyframes({
  '0%': { opacity: 0.5 },
  '100%': { opacity: 0 },
});

const wrapper = css({
  zIndex: 1000,
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}).toString();

const background = {
  base: css({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    animation: `${fadeInPickerBackground} ${fadeDuration}ms 1 both`,
  }).toString(),
  inactive: css({
    animation: `${fadeOutPickerBackground} ${fadeDuration}ms 1 both`,
  }).toString(),
};

const container = {
  base: css({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: themeColors.light,
    animation: `${slideInPickerModal} ${slideDuration}ms 1 both ${easing}`,
  }).toString(),
  inactive: css({
    animation: `${slideOutPickerModal} ${slideDuration}ms 1 both ${easing}`,
  }).toString(),
};

export default {
  background,
  container,
  wrapper,
  duration: Math.max(slideDuration, fadeDuration),
};
