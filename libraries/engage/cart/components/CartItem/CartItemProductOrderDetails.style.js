import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  paddingTop: variables.gap.small,
}).toString();

export const quantityLabel = css({
  textAlign: 'center',
  whiteSpace: 'nowrap',
}).toString();

export const label = css({

  ':after': {
    content: ': ',
  },
}).toString();

export const labelValue = css({
  fontWeight: 500,
  display: 'inline',
  color: 'var(--color-text-medium-emphasis)',
}).toString();

export const fulfillmentLabel = css({
  fontSize: 'inherit',
  ':before': {
    content: ' ',
  },
}).toString();
