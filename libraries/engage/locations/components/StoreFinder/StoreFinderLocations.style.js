import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const gapM = variables.gap.small + variables.gap.xsmall;

export const card = css({
  background: colors.light,
  marginBottom: gapM,
  ':last-of-type': {
    marginBottom: 0,
  },
  border: `1px solid ${colors.shade7}`,
  boxSizing: 'border-box',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
  borderRadius: 3,
}).toString();

export const cardList = css({
  padding: variables.gap.big,
}).toString();
