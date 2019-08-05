import { css } from 'glamor';
import { themeConfig, themeName } from '@shopgate/pwa-common/helpers/config';

const isIOS = themeName.includes('ios');
const { colors } = themeConfig;

const container = css(isIOS ? {
  fontSize: 14,
} : {
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

export default {
  badgeWrapper,
  container,
  details,
  title,
  wishlist,
};
