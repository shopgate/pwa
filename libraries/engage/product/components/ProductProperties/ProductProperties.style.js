import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables: { gap } = {} } = themeConfig;

export const container = css({
  fontSize: '0.875rem',
  padding: `0 ${gap.big}px ${gap.big}px`,
  marginBottom: 12,
});

export const label = css({
  paddingBottom: (gap.small * 1.5),
});

export const tableCell = css({
  maxWidth: 100,
  padding: `${gap.xsmall * 0.5}px ${gap.small}px`,
  overflowWrap: 'break-word',
  ':first-of-type': {
    paddingLeft: 0,
  },
  ':last-of-type': {
    paddingRight: 0,
  },
});
