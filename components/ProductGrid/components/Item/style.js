import { css } from 'glamor';
import colors from 'Styles/colors';

const container = css({
  position: 'relative',
  display: 'block',
  background: colors.light,
  fontSize: 15,
  height: '100%',
  padding: '0 5px',
}).toString();

const details = css({
  ':not(:empty)': {
    padding: '12px 0 30px',
  },
}).toString();

const title = css({
  fontSize: 'initial',
  lineHeight: 1.2,
  paddingRight: '1.5em',
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
}).toString();

const badgeWrapper = css({
  lineHeight: 1,
  position: 'absolute',
  left: 15,
  top: 10,
  width: 40,
}).toString();

const favorites = css({
  position: 'absolute',
  right: 16,
  left: 'auto',
  transform: 'translate3d(0, -50%, 0)',
  zIndex: 1,
}).toString();

export default {
  badgeWrapper,
  container,
  details,
  title,
  favorites,
};
