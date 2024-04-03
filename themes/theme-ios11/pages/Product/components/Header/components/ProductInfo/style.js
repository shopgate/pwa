import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const productInfo = css({
  marginTop: `${variables.gap.small / 2}px`,
  ':not(:last-child)': {
    marginBottom: `${variables.gap.small / 2}px`,
  },
}).toString();

export const backInStockButton = css({
  ':not(:empty)': {
    marginTop: `${variables.gap.small}px`,
  },
}).toString();

export const priceContainer = css({
  textAlign: 'right',
  marginLeft: variables.gap.big,
}).toString();
