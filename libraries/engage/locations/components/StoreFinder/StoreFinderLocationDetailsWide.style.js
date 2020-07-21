import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export const container = css({
  background: colors.light,
  border: `1px solid ${colors.shade7}`,
  boxSizing: 'border-box',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
  borderRadius: 3,
  padding: variables.gap.big,
}).toString();

const linePadding = {
  paddingBottom: variables.gap.big,
};

export const headingLine = css({
  ...linePadding,
  fontWeight: 500,
  fontSize: '1.125rem',
  lineHeight: '1.5rem',

}).toString();

export const storeName = css({
  paddingBottom: variables.gap.small,
});

export const storeDistance = css({
  textAlign: 'right',
  ':not(:empty)': {
    paddingBottom: variables.gap.small,
  },
  ' > *': {
    fontWeight: 500,
    fontSize: '1.125rem',
    lineHeight: '1.5rem',
  },
}).toString();

export const storeHours = css({
  ' > *': {
    color: 'var(--color-text-medium-emphasis)',
    fontWeight: 'normal',
  },
}).toString();

export const directionButton = css({
  minWidth: 220,
}).toString();

export const storeDetailsLine = css({
  ...linePadding,
  color: 'var(--color-text-medium-emphasis)',
  justifyContent: 'space-between',
}).toString();

export const storeAddress = css({
  ...linePadding,
  paddingRight: variables.gap.big,
  fontSize: '1.125rem',
  lineHeight: '1.5rem',

}).toString();

export const storePhoneNumber = css({
  fontSize: '1rem',
  ' a': {
    color: 'var(--color-primary)',
    textDecoration: 'underline',
  },
}).toString();

export const storeOpeningHours = css({
  paddingRight: variables.gap.big,
  ' > *': {
    color: 'var(--color-text-medium-emphasis)',
  },
}).toString();
