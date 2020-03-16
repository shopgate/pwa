// @flow
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const button = css({
  fontSize: '0.625rem !important',
  // textAlign: 'right',
  letterSpacing: '0.05em',
  padding: `${variables.gap.xsmall * 0.75}px 0 !important`,
}).toString();

export const ripple = css({
  padding: 0,
}).toString();
