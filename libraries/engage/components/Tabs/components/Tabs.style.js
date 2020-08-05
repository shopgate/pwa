import { css } from 'glamor';

export const root = css({
  overflow: 'hidden',
  minHeight: 48,
  WebkitOverflowScrolling: 'touch', // Add iOS momentum scrolling.
  display: 'flex',
  position: 'relative',
}).toString();

export const fixed = css({
  overflowX: 'hidden',
  width: '100%',
}).toString();

export const flexContainer = css({
  display: 'flex',
}).toString();

export const centered = css({
  justifyContent: 'center',
}).toString();
