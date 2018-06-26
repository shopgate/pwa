import { css } from 'glamor';
import colors from 'Styles/colors';

const button = css({
  outline: 0,
  padding: '16px 16px 16px 72px',
  textAlign: 'left',
  width: '100%',
});

const buttonDisabled = css(button, {
  color: colors.shade4,
});

export default {
  button,
  buttonDisabled,
};
