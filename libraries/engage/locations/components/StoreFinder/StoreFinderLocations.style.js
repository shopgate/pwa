import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const gapM = variables.gap.small + variables.gap.xsmall;

export const container = css({
  borderTop: `1px solid ${colors.shade7}`,
  overflowY: 'scroll',
  WebkitOverflowScrolling: 'touch',
  height: '100%',
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
    paddingTop: 2,
    borderTop: 'none',
  },
});

export const cardList = css({
  padding: variables.gap.big,
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
    paddingTop: 0,
  },
}).toString();

export const card = css({
  background: colors.light,
  marginBottom: gapM,
  border: `1px solid ${colors.shade7}`,
  boxSizing: 'border-box',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
  borderRadius: 3,
}).toString();

