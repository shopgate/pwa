import { css } from 'glamor';
import colors from 'Styles/colors';

const button = css({
  outline: 0,
  padding: '16px 16px 16px 72px',
  textAlign: 'left',
  width: '100%',
}).toString();

const buttonDisabled = css({
  color: colors.shade4,
}).toString();

export default {
  button,
  buttonDisabled,
};
