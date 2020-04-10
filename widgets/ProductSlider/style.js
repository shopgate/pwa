import { css } from 'glamor';
import { themeVariables, themeColors } from '@shopgate/pwa-common/helpers/config';

const sliderContainer = css({
  marginLeft: 'auto',
  marginRight: 'auto',
  position: 'relative',
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
  color: `var(--color-primary, ${themeColors.primary})`,
  fontSize: '1rem',
}).toString();

const card = css({
  background: themeColors.light,
  height: '100%',
  margin: '0px 8px',
  borderRadius: 11,
}).toString();

const headline = css({
  fontSize: 18,
  margin: `0 0 ${themeVariables.gap.big}px`,
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
