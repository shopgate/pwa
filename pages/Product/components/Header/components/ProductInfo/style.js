import { css } from 'glamor';
import variables from 'Styles/variables';

export const productInfo = css({
  marginTop: `${variables.gap.small / 2}px`,
  ':not(:last-child)': {
    marginBottom: `${variables.gap.small / 2}px`,
  },
}).toString();

export const priceContainer = css({
  textAlign: 'right',
  marginLeft: variables.gap.big,
}).toString();
