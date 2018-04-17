import { css } from 'glamor';
import colors from 'Styles/colors';

const container = css({
  display: 'flex',
  position: 'relative',
  whiteSpace: 'nowrap',
}).toString();

const disclaimer = css({
  color: 'initial',
  position: 'absolute',
  right: -10,
  top: 0,
}).toString();

const discounted = css({
  color: colors.primary,
}).toString();

export default {
  container,
  disclaimer,
  discounted,
};
