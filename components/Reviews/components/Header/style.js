import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const containerDefaults = {
  fontWeight: 500,
  margin: 0,
};

const container = css(containerDefaults).toString();

const withTopGapContainer = css({
  ...containerDefaults,
  marginTop: variables.gap.xbig,
}).toString();

const reviewsLine = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  padding: `0 0 ${variables.gap.small}px`,
  marginBottom: -2,
}).toString();

const averageRatingNumber = css({
  color: colors.primary,
  marginLeft: variables.gap.small,
}).toString();

const averageRatingText = css({
  marginLeft: variables.gap.big,
}).toString();

const noReviews = css({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: variables.gap.small,
  padding: `0 ${variables.gap.big}px`,
  textAlign: 'center',
}).toString();

export default {
  container,
  reviewsLine,
  averageRatingNumber,
  averageRatingText,
  withTopGapContainer,
  noReviews,
};
