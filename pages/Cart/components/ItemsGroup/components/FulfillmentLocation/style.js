import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const accordionToggle = css({
  paddingTop: variables.gap.xsmall,
  paddingBottom: variables.gap.xsmall,
}).toString();

export const address = css({
  display: 'flex',
  flexFlow: 'row nowrap',
  fontSize: '0.875rem',
});

export const addressIcon = css({
  fontSize: '1.25rem',
  padding: `2px ${variables.gap.small}px 0 0`,
  paddingTop: variables.gap.small,
});

export const title = css({
  fontWeight: 600,
});

export const addressDetails = css({
  fontSize: '0.875rem',
  paddingLeft: variables.gap.xbig,
});
