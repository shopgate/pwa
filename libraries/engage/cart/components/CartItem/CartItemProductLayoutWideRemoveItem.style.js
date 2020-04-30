// @flow
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const button = css({
  fontSize: '0.875rem !important',
  letterSpacing: '0.05em',
  padding: `${variables.gap.big}px 0 !important`,
  ' *': {
    padding: '0 !important',
  },
}).toString();

export const ripple = css({
  padding: 0,
}).toString();
