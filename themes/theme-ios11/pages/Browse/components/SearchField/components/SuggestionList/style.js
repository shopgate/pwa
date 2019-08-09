import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

/**
 * Manipulates the css when keyboard is opened to keep the UI scrollable.
 * @param {number} value Keyboard overlap value.
 * @returns {string}
 */
const bottom = value => css({
  paddingBottom: value,
}).toString();

const list = css({
  fontSize: 16,
  fontWeight: 400,
  marginTop: 4,
  bottom: 0,
  position: 'absolute',
  left: 0,
  right: 0,
  top: 120,
  backgroundColor: colors.light,
  overflowY: 'scroll',
  zIndex: 3,
  borderTop: `0.5px ${colors.dividers} solid`,
  paddingTop: 5,
}).toString();

const item = css({
  alignItems: 'center',
  background: colors.light,
  display: 'flex',
  marginTop: 2,
  outline: 0,
  padding: '10px 16px 10px 46px',
  width: '100%',
  textAlign: 'left',
}).toString();

export default {
  bottom,
  list,
  item,
};
