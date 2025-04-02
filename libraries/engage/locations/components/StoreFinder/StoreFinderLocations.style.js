import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const gapM = variables.gap.small + variables.gap.xsmall;

export const container = css({
  paddingTop: 2,
  borderTop: 'none',
  overflowY: 'unset',
  WebkitOverflowScrolling: 'unset',
});

export const cardList = css({
  paddingTop: 0,
}).toString();

export const card = css({
  background: colors.light,
  border: `1px solid ${colors.shade7}`,
  boxSizing: 'border-box',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
  borderRadius: 3,
  ':not(:last-child)': {
    marginBottom: gapM,
  },
}).toString();
