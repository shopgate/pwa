import { css } from 'glamor';

const stateOk = css({
  fontSize: '0.875rem',
  color: 'var(--color-state-ok)',
}).toString();

const stateWarning = css({
  fontSize: '0.875rem',
  color: 'var(--color-state-warning)',
}).toString();

const stateAlert = css({
  fontSize: '0.875rem',
  color: 'var(--color-state-alert)',
}).toString();

export default {
  stateOk,
  stateWarning,
  stateAlert,
};
