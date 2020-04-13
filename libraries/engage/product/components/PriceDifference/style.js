import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const positive = css({
  color: colors.shade4,
  ':before': {
    content: '"+"',
  },
}).toString();

const negative = css({
  color: `var(--color-primary, ${colors.primary})`,
}).toString();

export default {
  positive,
  negative,
};
