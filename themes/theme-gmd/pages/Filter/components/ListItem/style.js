import { css } from 'glamor';
import colors from 'Styles/colors';

const item = css({
  background: colors.light,
  position: 'relative',
}).toString();

const gridItem = css({
  maxWidth: '100%',
  minWidth: '40%',
}).toString();

const ripple = css({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}).toString();

const rightContainer = css({
  ...gridItem,
  justifyContent: 'flex-end',
  paddingRight: 40,
  overflow: 'hidden',
}).toString();

export default {
  item,
  gridItem,
  ripple,
  rightContainer,
};
