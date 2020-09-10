import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const wrapper = css({
  display: 'flex',
  flexDirection: 'column',
  fontSize: '0.875rem',
  padding: `0 ${variables.gap.big}px`,
  flexShrink: 0,
});

export const heading = css({
  color: 'var(--color-text-medium-emphasis)',
});

export const name = css({
  fontWeight: 500,
  color: 'var(--color-text-high-emphasis)',
});

export const button = css({
  fontSize: '0.625rem !important',
  letterSpacing: '0.05em',
  padding: `${variables.gap.xsmall * 0.75}px 0 !important`,
  ' *': {
    padding: '0 !important',
  },
}).toString();
