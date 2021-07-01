import { css } from 'glamor';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

const content = css({
  position: 'relative',
  backgroundColor: themeColors.light,
  padding: themeVariables.gap.big,
  borderTop: `${themeColors.placeholder} 2px solid`,
}).toString();

const price = css({
  justifyContent: 'flex-end',
}).toString();

const priceInfo = css({
  marginTop: 3,
  ':not(:last-child)': {
    marginBottom: 3,
  },
}).toString();

const productInfo = css({
  marginTop: `${themeVariables.gap.small / 2}px`,
  ':not(:last-child)': {
    marginBottom: `${themeVariables.gap.small / 2}px`,
  },
}).toString();

const priceContainer = css({
  textAlign: 'right',
  marginLeft: themeVariables.gap.big,
}).toString();

const placeholder = {
  info: css({
    height: 16,
    width: '70%',
    marginTop: 5,
    marginBottom: 2,
  }).toString(),
  price: css({
    height: 20,
    width: '50px',
    display: 'inline-block',
  }).toString(),
};

export default {
  content,
  productInfo,
  priceContainer,
  priceInfo,
  price,
  placeholder,
};
