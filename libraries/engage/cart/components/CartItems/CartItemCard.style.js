import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
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
  color: 'var(--color-text-heigh-emphasis)',
});

export const titles = css({
  marginTop: -3,
  marginBottom: -2,
  paddingRight: themeVariables.gap.big * 2,
});

export const name = css({
  fontSize: '0.85rem',
  fontWeight: 500,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    fontSize: '1.25rem',
    lineHeight: '1.5rem',
  },
});

export const method = css({
  fontSize: '0.75rem',
  color: themeColors.shade11,
});

export const locationAddress = css({
  fontSize: '0.85rem',
  color: 'var(--color-text-low-emphasis)',
});

export const locationHours = css({
  paddingTop: gap.big,
  fontSize: '0.85rem',
});
