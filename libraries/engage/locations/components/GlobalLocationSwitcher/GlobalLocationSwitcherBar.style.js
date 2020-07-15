import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const wrapper = css({
  fontSize: '0.875rem',
  color: 'var(--color-text-high-emphasis)',
  background: 'var(--color-background-accent)',
}).toString();

export const inner = css({
  display: 'flex',
  flexShrink: 0,
  margin: `0 ${variables.gap.big}px`,
  borderBottom: '1px solid #eaeaea',
  alignItems: 'center',
  height: variables.filterbar.height,
}).toString();

export const innerStandalone = css({
  borderBottom: 'none',
}).toString();

export const heading = css({
  paddingRight: variables.gap.small,
  ':after': {
    content: ':',
  },
}).toString();

export const name = css({
  fontWeight: 500,
}).toString();

export const button = css({
  marginLeft: 'auto',
  letterSpacing: '0.05em',
  padding: `${variables.gap.xsmall * 0.75}px 0 !important`,
  ' *': {
    fontSize: '0.875rem',
    textTransform: 'initial',
    padding: '0 !important',
    color: 'var(--color-text-high-emphasis)',
    fontWeight: 500,
  },
}).toString();
