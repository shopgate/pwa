import { css } from 'glamor';

/**
 * The style object for a one line text element with an ellipsis on overflow.
 */
const ellipsisLine = {
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

/**
 * The styles for the error message.
 */
const error = css({
  position: 'absolute',
  bottom: 2,
  fontSize: 12,
  lineHeight: '14px',
  color: 'var(--color-state-alert)',
  ...ellipsisLine,
}).toString();

export default {
  error,
};
