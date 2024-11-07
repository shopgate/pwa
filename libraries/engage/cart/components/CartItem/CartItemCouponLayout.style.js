import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const item = css({
  fontSize: '0.875rem',
  padding: `${variables.gap.small / 2}px ${variables.gap.big}px`,
}).toString();

export const icon = css({
  fontSize: '3rem',
  flexShrink: 0,
  margin: '5px 12px 0 12px',
}).toString();

export const content = css({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: variables.gap.big,
  paddingTop: variables.gap.small,
  paddingBottom: variables.gap.small,
  // took from https://stackoverflow.com/a/36247448
  // in order to prevent the long coupon codes from
  // breaking the ui, we need to reset the default
  // flexbox settings (taken from CCP-2475)
  minWidth: 0,
}).toString();

export const contentLast = css({
  alignItems: 'flex-end',
}).toString();
