import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  display: 'flex',
  padding: `${variables.gap.xbig}px ${variables.gap.big}px ${variables.gap.big}px ${variables.gap.big}px`,
}).toString();

export const button = css({
  fontSize: '0.875rem !important',
  padding: '0 !important',
  ' > div ': {
    padding: 0,
    display: 'flex',
  },
}).toString();

export const buttonIcon = css({
  display: 'inline-block',
  fontSize: '1.375rem !important',
  alignSelf: 'center',
  marginRight: variables.gap.xsmall,
  marginLeft: -3,
  marginTop: -2,
}).toString();
