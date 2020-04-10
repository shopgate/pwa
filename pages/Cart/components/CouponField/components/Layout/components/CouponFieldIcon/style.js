import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const iconCircleEnabled = css({
  fill: `var(--color-primary, ${colors.primary})`,
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
