import { css } from 'glamor';
import variables from 'Styles/variables';
import colors from 'Styles/colors';

export const container = css({
  fontWeight: 500,
  margin: 0,
});

export const withTopGapContainer = css(container, {
  marginTop: variables.gap.xbig,
});

export const reviewsLine = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  padding: `0 0 ${variables.gap.small}px`,
  marginBottom: -2,
});

export const averageRatingNumber = css({
  color: colors.primary,
  marginLeft: variables.gap.small,
}).toString();

export const averageRatingText = css({
  marginLeft: variables.gap.big,
}).toString();
