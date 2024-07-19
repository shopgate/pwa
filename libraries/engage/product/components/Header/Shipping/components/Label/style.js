import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const text = css({
  color: `var(--color-state-ok, ${colors.success})`,
}).toString();

export default {
  text,
};
