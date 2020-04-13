import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

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
  color: `var(--color-primary, ${colors.primary})`,
  marginLeft: variables.gap.small,
}).toString();

export const averageRatingText = css({
  marginLeft: variables.gap.big,
}).toString();
