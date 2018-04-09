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
  lineHeight: 1.35,
  ':not(:empty)': {
    padding: '12px 16px',
  },
}).toString();

const title = css({
  fontWeight: '500',
  lineHeight: 1.15,
  marginTop: 1,
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
}).toString();

const priceWrapper = css({
  lineHeight: 1.75,
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

const favorites = css({
  position: 'absolute',
  right: 16,
  left: 'auto',
  transform: 'translate3d(0, -50%, 0)',
}).toString();

export default {
  badgeWrapper,
  basicPrice,
  container,
  details,
  priceWrapper,
  title,
  favorites,
};
