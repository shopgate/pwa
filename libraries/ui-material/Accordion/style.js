import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export const toggle = css({
  padding: '12px 56px 12px 16px',
  position: 'relative',
});

export const chevronContainer = css({
  cursor: 'pointer',
  fontSize: '1.5rem',
  position: 'absolute',
  right: '1rem',
  top: '50%',
  transform: 'translate3d(0, -50%, 0)',
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 32,
    padding: 8,
  },
});

export const chevron = css({
  transformOrigin: 'center center',
  transition: 'transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
});

export const chevronClosed = css(chevron, {
  transform: 'rotateZ(-90deg)',
}).toString();

export const chevronOpen = css(chevron, {
  transform: 'rotateZ(90deg)',
}).toString();
