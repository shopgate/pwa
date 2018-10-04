import { css } from 'glamor';
import colors from 'Styles/colors';

const disabled = css({
  color: `${colors.shade4} !important`,
}).toString();

const totalLabel = css({
  fontSize: 16,
}).toString();

export default {
  disabled,
  totalLabel,
};
