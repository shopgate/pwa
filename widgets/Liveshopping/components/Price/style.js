import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const grid = css({
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  marginTop: variables.gap.small,
}).toString();

const priceStriked = css({
  fontSize: '0.875rem',
}).toString();

const price = css({
  color: `var(--color-primary, ${colors.primary})`,
  fontSize: '1.25rem',
  lineHeight: 1,
}).toString();

export default {
  grid,
  price,
  priceStriked,
};
