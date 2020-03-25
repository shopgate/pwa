// @flow
import { css } from 'glamor';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

const { gap } = themeVariables;

export const withBorder = css({
  borderBottom: `1px solid ${themeColors.shade7}`,
});

export const accordionToggle = css({
  padding: `${gap.big * 1.25}px ${gap.big}px`,
}).toString();

export const accordionContent = css({
  paddingLeft: gap.xbig * 1.25,
});

export const address = css({
  display: 'flex',
  flexFlow: 'row nowrap',
});

export const addressIcon = css({
  fontSize: '1.25rem',
  marginRight: gap.big * 1.25,
  flexShrink: 0,
  color: themeColors.shade9,
});

export const titles = css({
  marginTop: -3,
  marginBottom: -2,
});

export const name = css({
  fontSize: '0.85rem',
  fontWeight: 500,
});

export const method = css({
  fontSize: '0.75rem',
  color: themeColors.shade3,
});

export const locationAddress = css({
  color: themeColors.shade3,
  fontSize: '0.85rem',
});

export const locationHours = css({
  paddingTop: gap.big,
  fontSize: '0.85rem',
});
