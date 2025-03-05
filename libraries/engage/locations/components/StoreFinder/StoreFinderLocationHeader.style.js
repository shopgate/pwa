import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  padding: variables.gap.big,
  display: 'flex',
  flexDirection: 'column',
  color: 'var(--color-text-low-emphasis)',
  ' > *': {
    margin: 0,
  },
  ' svg': {
    color: 'var(--color-text-low-emphasis)',
  },
  ' li': {
    paddingTop: 0,
  },
  ' a': {
    color: 'var(--color-primary)',
    textDecoration: 'underline',
  },

  fontSize: '0.875rem',
  lineHeight: '1.5rem',
  ' > *:not(:last-child)': {
    paddingBottom: variables.gap.xsmall,
    paddingTop: 0,
  },
}).toString();

export const clickable = css({
  ' > *': {
    margin: 0,
    paddingTop: 0,
  },
  ' > *:not(:last-child)': {
    paddingBottom: variables.gap.xsmall,
    paddingTop: 0,
  },
}).toString();

export const storeName = css({
  fontSize: '1rem',
  fontWeight: 500,
  color: 'var(--color-text-high-emphasis)',
}).toString();

export const myStoreWrapper = css({
  display: 'flex',
  alignItems: 'center',
}).toString();

export const myStore = css({
  color: 'var(--color-primary)',
  fontSize: '1rem',
  fontWeight: 500,
}).toString();

export const myStoreIcon = css({
  ' svg': {
    color: 'var(--color-primary)',
  },
  marginRight: '4px',
}).toString();

export const storeNameWrapper = css({
  flexWrap: 'wrap',
  display: 'flex',
  gap: '2px 12px',
});

export const storeDistance = css({
  lineHeight: '1.65rem',
  paddingLeft: variables.gap.small,
}).toString();

export const storeHoursToday = css({
  ' > *': {
    color: 'var(--color-text-low-emphasis)',
  },
}).toString();
