import { css } from 'glamor';
import colors from 'Styles/colors';

const badge = {
  background: colors.primary,
  borderRadius: 3,
  color: colors.primaryContrast,
  paddingTop: 5,
  paddingBottom: 5,
  width: '100%',
  fontWeight: 700,
  textAlign: 'center',
  display: 'inline-block',
  lineHeight: 1,
};

/**
 * The discount badge styles that can be selected by passing the style key.
 * @type {Object}
 */
export default {
  small: css({
    ...badge,
    fontSize: '0.7rem',
  }).toString(),
  big: css({
    ...badge,
    paddingTop: 7,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: '0.875rem',
  }).toString(),
};
