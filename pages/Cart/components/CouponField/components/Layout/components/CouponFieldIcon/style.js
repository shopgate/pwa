import { css } from 'glamor';
import colors from 'Styles/colors';

const iconCircleEnabled = css({
  fill: colors.primary,
}).toString();

const iconArrowEnabled = css({
  fill: colors.light,
}).toString();

const iconCircleDisabled = css({
  fill: colors.shade7,
}).toString();

const iconArrowDisabled = css({
  fill: colors.shade4,
}).toString();

export default {
  iconCircleEnabled,
  iconArrowEnabled,
  iconCircleDisabled,
  iconArrowDisabled,
};
