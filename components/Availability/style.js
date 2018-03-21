import { css } from 'glamor';
import colors from 'Styles/colors';

const stateOk = css({
  color: colors.success,
}).toString();

const stateWarning = css({
  color: colors.warning,
}).toString();

const stateAlert = css({
  color: colors.error,
}).toString();

export default {
  stateOk,
  stateWarning,
  stateAlert,
};
