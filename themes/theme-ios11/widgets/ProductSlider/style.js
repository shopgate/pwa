import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const sliderContainer = css({
  marginLeft: 'auto',
  marginRight: 'auto',
  position: 'relative',
  // Must be 2px more than card's box shadow,
  // (otherwise there's a white artifact on the iOS visible)
  paddingBottom: 10,
}).toString();

const slider = css({
  width: '100%',
  flex: 1,
  paddingTop: 16,
  paddingBottom: 16,
}).toString();

const sliderItem = css({
  width: '50%',
}).toString();

const productInfo = css({
  padding: 15,
}).toString();

const productName = css({
  fontWeight: 500,
}).toString();

const priceGrid = css({
  alignItems: 'flex-end',
}).toString();

const priceStrikedItem = css({
  flexGrow: 1,
}).toString();

const priceItem = css({
  flexGrow: 1,
  textAlign: 'right',
}).toString();

const priceBase = css({
  padding: '0 15px',
}).toString();

const priceStriked = css({
  ...priceBase,
  fontSize: '0.875rem',
}).toString();

const price = css({
  ...priceBase,
  color: colors.primary,
  fontSize: '1rem',
}).toString();

const card = css({
  background: '#FFF',
  height: '100%',
  margin: '0px 8px',
  borderRadius: variables.borderRadius.default,
}).toString();

const headline = css({
  fontSize: 18,
  margin: `0 0 ${variables.gap.big}px`,
  textAlign: 'center',
}).toString();

export default {
  card,
  headline,
  sliderContainer,
  slider,
  sliderItem,
  productInfo,
  productName,
  priceGrid,
  priceStrikedItem,
  priceItem,
  priceBase,
  priceStriked,
  price,
};
