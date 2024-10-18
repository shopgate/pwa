import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export const toggle = css({
  padding: '12px 16px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
}).toString();

export const clickable = css({
  cursor: 'pointer',
}).toString();

export const toggleLeftAligned = css({
  flexDirection: 'row-reverse',
});

export const chevronContainer = css({
  display: 'flex',
  flexShrink: 0,
  fontSize: '1.5rem',
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 32,
    padding: 8,
  },
}).toString();

export const labelContainer = css({
  marginRight: 'auto',
  display: 'flex',
  flex: 1,
  alignItems: 'center',
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
