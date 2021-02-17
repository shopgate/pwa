import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const content = css({
  background: colors.light,
  position: 'relative',
  padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
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
  marginTop: `${variables.gap.small / 2}px`,
  ':not(:last-child)': {
    marginBottom: `${variables.gap.small / 2}px`,
  },
}).toString();

const priceContainer = css({
  textAlign: 'right',
  marginLeft: variables.gap.big,
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
