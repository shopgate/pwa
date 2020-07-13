import MobileDetect from 'mobile-detect';
import { logger } from '@shopgate/engage/core';

const md = new MobileDetect(navigator.userAgent);

const SELECTOR_BODY = 'html, body';
const SELECTOR_CONTENT = '#AppContent';

let currentRef = null;

/**
 * Toggles the body scroll on mobile phones
 * @param {boolean} locked The lock state
 * @param {*} ref A reference parameter to take care that only the locker can unlock
 */
export const toggleBodyScroll = (locked = true, ref = null) => {
  if (!ref) {
    logger.error('No caller reference provided');
  }

  if (!md.phone()) {
    return;
  }

  /* eslint-disable no-param-reassign */
  if (locked) {
    currentRef = ref;

    const offsetY = window.pageYOffset;

    document.querySelectorAll(SELECTOR_BODY).forEach((el) => {
      el.style.height = '100%';
      el.style.position = 'fixed';
      el.style.overflow = 'hidden';
    });

    const content = document.querySelector(SELECTOR_CONTENT);

    if (content) {
      content.style.top = `${offsetY * -1}px`;
    }
  } else {
    if (currentRef !== ref) {
      return;
    }

    document.querySelectorAll(SELECTOR_BODY).forEach((el) => {
      el.style.removeProperty('height');
      el.style.removeProperty('position');
      el.style.removeProperty('overflow');
    });

    const content = document.querySelector(SELECTOR_CONTENT);

    if (content) {
      window.scrollTo(0, Math.abs(parseInt(content.style.top || 0, 10)));
      content.style.removeProperty('top');
    }
  }

  /* eslint-enable no-param-reassign */
};
