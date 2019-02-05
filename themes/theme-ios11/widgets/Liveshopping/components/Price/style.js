import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

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
  color: colors.primary,
  fontSize: '1.25rem',
  lineHeight: 1,
}).toString();

export default {
  grid,
  price,
  priceStriked,
};
