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

export const grandTotalContainer = css({
  fontSize: '1.25rem',
  fontWeight: 500,
  borderTop: `1px solid ${colors.shade4}`,
}).toString();
