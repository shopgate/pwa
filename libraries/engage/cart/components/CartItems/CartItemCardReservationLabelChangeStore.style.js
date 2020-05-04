// @flow
import { css } from 'glamor';

export const button = css({
  fontSize: '0.875rem !important',
  letterSpacing: '0.05em',
  padding: '0px !important',
  ' *': {
    padding: '0px !important',
  },
}).toString();

export const ripple = css({
  padding: 0,
}).toString();
