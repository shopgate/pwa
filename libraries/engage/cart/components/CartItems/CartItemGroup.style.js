import { css } from 'glamor';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';

const { gap } = themeVariables;

export const accordionToggle = css({
  paddingTop: gap.xsmall,
  paddingBottom: gap.xsmall,
}).toString();

export const simpleLabel = css({
  padding: `${gap.xsmall}px ${gap.xbig}px ${gap.xsmall}px ${gap.big}px`,
});

export const address = css({
  display: 'flex',
  flexFlow: 'row nowrap',
  fontSize: '0.875rem',
});

export const addressIcon = css({
  fontSize: '1.25rem',
  padding: `${gap.small}px ${gap.small}px 0 0`,
  paddingTop: gap.small,
  flexShrink: 0,
});

export const shippingIcon = css({
  fontSize: '1.25rem',
  padding: `${gap.small}px ${gap.big}px ${gap.small}px 0`,
  transform: 'rotateY(180deg)',
});

export const title = css({
  fontWeight: 600,
});

export const shippingTitle = css({
  fontWeight: 600,
  padding: gap.small,
});

export const addressDetails = css({
  fontSize: '0.875rem',
  paddingLeft: gap.xbig,
});
