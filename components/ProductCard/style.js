import { css } from 'glamor';
import colors from 'Styles/colors';

const container = css({
  position: 'relative',
  display: 'block',
  background: colors.light,
  fontSize: 14,
  height: '100%',
}).toString();

const details = css({
  padding: '12px 16px',
  lineHeight: 1.35,
}).toString();

const title = css({
  fontWeight: '500',
  lineHeight: 1.15,
  marginTop: 1,
}).toString();

const priceWrapper = css({
  lineHeight: 1.75,
  alignItems: 'center',
}).toString();

const basicPrice = css({
  fontSize: '0.85em',
  marginTop: -1,
}).toString();

const badgeWrapper = css({
  lineHeight: 1,
  position: 'absolute',
  left: 10,
  top: 10,
  width: 40,
}).toString();

const wishlist = css({
  display: 'none',
  position: 'absolute',
  right: 16,
  left: 'auto',
  transform: 'translate3d(0, -50%, 0)',
}).toString();

const updateImageContainer = css({
  borderRadius: '0px',
}).toString();

const updateContainer = css({
  borderRadius: '0px',
}).toString();

export default {
  badgeWrapper,
  basicPrice,
  container,
  details,
  priceWrapper,
  title,
  wishlist,
  updateImageContainer,
  updateContainer,
};
