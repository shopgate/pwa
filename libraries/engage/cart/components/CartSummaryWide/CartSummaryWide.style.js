import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const container = css({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'flex-end',
  padding: variables.gap.big,
  width: 420,
});

export const headline = css({
  fontSize: '1.25rem',
  fontWeight: 500,
});

export const summary = css({
  background: colors.shade8,
  padding: variables.gap.big,
});

export const total = css({
  fontSize: '1rem',
  padding: `${variables.gap.small}px 0`,
}).toString();

export const grandTotal = css({
  fontSize: '1.25rem !important',
  fontWeight: 500,
  borderTop: `1px solid ${colors.shade4}`,
  padding: `${variables.gap.small}px 0`,
  '&:last-child': {
    paddingBottom: 0,
  },
}).toString();
