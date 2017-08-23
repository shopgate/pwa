import cxs from 'cxs';
import { colors } from 'Templates/styles';

const container = cxs({
  position: 'relative',
  display: 'block',
  background: colors.light,
  fontSize: 14,
  height: '100%',
});

const details = cxs({
  padding: '12px 16px',
  lineHeight: 1.35,
});

const title = cxs({
  fontWeight: '500',
  lineHeight: 1.15,
  marginTop: 1,
});

const striked = cxs({
  color: colors.primary,
  opacity: 0.5,
});

const priceWrapper = cxs({
  lineHeight: 1.75,
});

const basicPrice = cxs({
  fontSize: '0.85em',
  marginTop: -1,
});

const badgeWrapper = cxs({
  lineHeight: 1,
  position: 'absolute',
  left: 10,
  top: 10,
  width: 40,
});

const wishlist = cxs({
  display: 'none',
  position: 'absolute',
  right: 16,
  left: 'auto',
  transform: 'translate3d(0, -50%, 0)',
});

export default {
  badgeWrapper,
  basicPrice,
  container,
  details,
  priceWrapper,
  title,
  striked,
  wishlist,
};
